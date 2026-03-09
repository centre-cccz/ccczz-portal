import { NextResponse } from 'next/server';
import { withAuth, checkDirection } from '../../../lib/withAuth';
import { User } from '../../../lib/types';

// Simple file-backed storage for demo purposes
async function appendEventToStorage(evt: any) {
    const fs = await import('fs');
    const path = await import('path');
    const file = path.join(process.cwd(), 'data', 'events.json');
    const dir = path.dirname(file);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    let arr: any[] = [];
    if (fs.existsSync(file)) {
        try { arr = JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { arr = []; }
    }
    arr.push(evt);
    fs.writeFileSync(file, JSON.stringify(arr, null, 2));
}

async function appendHistory(entry: any) {
    const fs = await import('fs');
    const path = await import('path');
    const file = path.join(process.cwd(), 'data', 'events_history.json');
    const dir = path.dirname(file);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    let arr: any[] = [];
    if (fs.existsSync(file)) {
        try { arr = JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { arr = []; }
    }
    arr.push(entry);
    fs.writeFileSync(file, JSON.stringify(arr, null, 2));
}

export const POST = withAuth(async (request: Request, user: User | null) => {
    const url = new URL(request.url);
    const action = url.searchParams.get('action') || 'create';
    const body = await request.json();

    if (action === 'create') {
        // Rule: Create event -> ROLE_DACPA only
        if (!user) return NextResponse.json({ ok: false, error: 'auth required' }, { status: 401 });
        if (user.role !== 'ROLE_DACPA') return NextResponse.json({ ok: false, error: 'forbidden' }, { status: 403 });

        const direction = body.direction_owner;
        if (!checkDirection(user, direction, false)) return NextResponse.json({ ok: false, error: 'cannot act outside your direction' }, { status: 403 });

        const evt = {
            id: `evt_${Date.now()}`,
            title: body.title || 'untitled',
            direction_owner: direction,
            created_by: user.id,
            validated_by: null,
            status: 'draft',
            created_at: new Date().toISOString(),
        };
        await appendEventToStorage(evt);
        await appendHistory({ action: 'create', by: user.id, event: evt, at: new Date().toISOString() });
        return NextResponse.json({ ok: true, event: evt });
    }

    if (action === 'publish') {
        // Rule: Publish event -> DACPA then DG. Allow DACPA (same direction) or DG (cross)
        if (!user) return NextResponse.json({ ok: false, error: 'auth required' }, { status: 401 });
        if (!(user.role === 'ROLE_DACPA' || user.role === 'ROLE_DG')) return NextResponse.json({ ok: false, error: 'forbidden' }, { status: 403 });

        const direction = body.direction_owner;
        const allowCross = user.role === 'ROLE_DG';
        if (!checkDirection(user, direction, allowCross)) return NextResponse.json({ ok: false, error: 'cannot act outside your direction' }, { status: 403 });

        const validatedBy = user.id;
        // In a real app update DB row; here append history and mark in storage
        await appendHistory({ action: 'publish', by: user.id, direction, at: new Date().toISOString(), note: body.note || null });
        return NextResponse.json({ ok: true, validated_by: validatedBy });
    }

    return NextResponse.json({ ok: false, error: 'unknown action' }, { status: 400 });
});
