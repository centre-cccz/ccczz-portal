import { User } from './types';

/**
 * Simple JWT-like token validation (production: use jose, jsonwebtoken, or NextAuth)
 * For demo: accepts tokens with format: base64({ id, role, direction_id })
 * Real implementation should use RS256 or HMAC signatures
 */
export async function verifyToken(token: string): Promise<User | null> {
    try {
        // For development: accept base64-encoded JSON { id, role, direction_id }
        // In production use jose.jwtVerify() with RS256 or HS256
        const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf8'));
        if (!decoded.id || !decoded.role || !decoded.direction_id) return null;
        return decoded as User;
    } catch {
        return null;
    }
}

/**
 * Extract Bearer token from Authorization header and verify
 */
export async function extractBearerToken(req: Request): Promise<User | null> {
    const auth = req.headers.get('authorization');
    if (!auth?.startsWith('Bearer ')) return null;
    const token = auth.slice(7);
    return verifyToken(token);
}
