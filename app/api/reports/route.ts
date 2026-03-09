import { NextResponse } from 'next/server';
import { withAuth } from '../../../lib/withAuth';
import { User } from '../../../lib/types';
import { validateDirection } from '../../../lib/rbac';

export const POST = withAuth(async (request: Request, user: User | null) => {
    // Example: Power BI export endpoint with strict direction filtering (C3: FIXED)
    if (!user) return NextResponse.json({ ok: false, error: 'auth required' }, { status: 401 });
    if (!(user.role === 'ROLE_FINANCE' || user.role === 'ROLE_DG')) return NextResponse.json({ ok: false, error: 'forbidden' }, { status: 403 });

    const body = await request.json();
    const requestedDirection = body.direction;
    const targetDirection = requestedDirection || user.direction_id;

    // CRITICAL FIX C3: Validate direction using strict validateDirection()
    // Finance can only export own direction; DG can export any direction
    if (!validateDirection(user, targetDirection)) {
        return NextResponse.json({ ok: false, error: 'cannot export other direction reports' }, { status: 403 });
    }

    // Return a stubbed dataset location / filtered by direction
    // Real implementation should generate export and return signed URL or push to Power BI.
    return NextResponse.json({
        ok: true,
        export: {
            provider: 'powerbi',
            direction: targetDirection,
            url: `/exports/powerbi/${targetDirection}.xlsx`,
            timestamp: new Date().toISOString()
        }
    });
}, { allowedRoles: ['ROLE_FINANCE', 'ROLE_DG'] });
