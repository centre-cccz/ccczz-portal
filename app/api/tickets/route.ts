import { NextResponse } from 'next/server';
import { withAuth } from '../../../lib/withAuth';
import { User } from '../../../lib/types';
import { checkDirection } from '../../../lib/rbac';

async function appendTicketHistory(entry: any) {
    const fs = await import('fs');
    const path = await import('path');
    const file = path.join(process.cwd(), 'data', 'tickets_history.json');
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
    const action = url.searchParams.get('action') || 'price-change';
    const body = await request.json();

    if (action === 'price-change') {
        // Rule: Modify ticket price -> Finance only
        if (!user) return NextResponse.json({ ok: false, error: 'auth required' }, { status: 401 });
        if (user.role !== 'ROLE_FINANCE') return NextResponse.json({ ok: false, error: 'forbidden' }, { status: 403 });

        const direction = body.direction_owner;
        if (!checkDirection(user, direction, false)) return NextResponse.json({ ok: false, error: 'cannot act outside your direction' }, { status: 403 });

        // Persist change to storage (demo)
        await appendTicketHistory({ action: 'price-change', by: user.id, newPrice: body.newPrice, direction, at: new Date().toISOString() });
        return NextResponse.json({ ok: true });
    }

    if (action === 'revenue') {
        // Rule: Consultation revenus -> Finance + DG, filtered by direction (C2: FIX)
        if (!user) return NextResponse.json({ ok: false, error: 'auth required' }, { status: 401 });
        if (!(user.role === 'ROLE_FINANCE' || user.role === 'ROLE_DG')) return NextResponse.json({ ok: false, error: 'forbidden' }, { status: 403 });

        const requestedDirection = url.searchParams.get('direction');
        const targetDirection = requestedDirection || user.direction_id;

        // CRITICAL FIX C2: Validate direction strictly
        // Finance can only see own direction; DG can see any
        if (user.role === 'ROLE_FINANCE' && targetDirection !== user.direction_id) {
            return NextResponse.json({ ok: false, error: 'cannot access other direction revenue' }, { status: 403 });
        }

        // In real app query DB aggregated revenue. Here return stub.
        return NextResponse.json({ ok: true, direction: targetDirection, revenue: { total: 1234.56 } });
    }

    return NextResponse.json({ ok: false, error: 'unknown action' }, { status: 400 });
});
