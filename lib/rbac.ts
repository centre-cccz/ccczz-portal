import { User, Role, CROSS_DIRECTION_ROLES } from './types';
import { NextResponse } from 'next/server';

export function parseRole(raw?: string): Role | null {
    if (!raw) return null;
    const r = raw.toUpperCase();
    switch (r) {
        case 'ROLE_DACPA':
        case 'DACPA':
            return 'ROLE_DACPA';
        case 'ROLE_DG':
        case 'DG':
            return 'ROLE_DG';
        case 'ROLE_FINANCE':
        case 'FINANCE':
            return 'ROLE_FINANCE';
        case 'ROLE_BIBLIOTHEQUE':
        case 'BIBLIOTHEQUE':
            return 'ROLE_BIBLIOTHEQUE';
        case 'ROLE_PUBLIC':
        case 'PUBLIC':
            return 'ROLE_PUBLIC';
        case 'ROLE_ADMIN':
        case 'ADMIN':
            return 'ROLE_ADMIN';
        default:
            return null;
    }
}

// Extracts user from request: first tries JWT (Bearer token), then fallback to headers (dev-only)
export async function extractUserFromRequest(req: Request): Promise<User | null> {
    try {
        // Priority 1: JWT Bearer token (production)
        const auth = req.headers.get('authorization');
        if (auth?.startsWith('Bearer ')) {
            const token = auth.slice(7);
            const { verifyToken } = await import('./jwt');
            const user = await verifyToken(token);
            if (user) return user;
        }

        // Priority 2: Dev headers (x-user-id, x-user-role, x-user-direction-id)
        // WARNING: dev-only, never use in production
        const headers = req.headers;
        const id = headers.get('x-user-id');
        const roleRaw = headers.get('x-user-role');
        const direction = headers.get('x-user-direction-id');
        if (process.env.NODE_ENV === 'development' && id && roleRaw && direction) {
            const role = parseRole(roleRaw);
            if (role) return { id, role, direction_id: direction } as User;
        }
        return null;
    } catch (err) {
        return null;
    }
}

export function requireRole(user: User | null, allowed: Role[] | Role): boolean {
    if (!user) return false;
    const list = Array.isArray(allowed) ? allowed : [allowed];
    return list.includes(user.role);
}

export function checkDirection(user: User | null, resourceDirection: string | null, allowCross = false): boolean {
    if (!user) return false;
    if (!resourceDirection) return true; // if resource not tied to a direction, allow by direction
    if (user.direction_id === resourceDirection) return true;
    if (allowCross && CROSS_DIRECTION_ROLES.includes(user.role)) return true;
    return false;
}

/**
 * Stricter direction validation: must be exact match OR user is DG
 * Used for sensitive operations like revenue/reports access
 */
export function validateDirection(user: User | null, targetDirection: string | null): boolean {
    if (!user || !targetDirection) return false;
    // Only exact match or DG (cross-direction)
    return user.direction_id === targetDirection || user.role === 'ROLE_DG';
}

export function unauthorizedJson(message = 'unauthorized') {
    return NextResponse.json({ ok: false, error: message }, { status: 401 });
}

export function forbiddenJson(message = 'forbidden') {
    return NextResponse.json({ ok: false, error: message }, { status: 403 });
}
