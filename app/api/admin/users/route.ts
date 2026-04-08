import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import crypto from 'crypto';

function hashPassword(password: string) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, fullName, password, role, direction } = body;

    if (!email || !fullName || !password || !role || !direction) {
      return NextResponse.json({ message: 'Tous les champs sont requis.' }, { status: 400 });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const passwordHash = hashPassword(String(password));

    // Validate role and direction exist
    const roleRows = await query<{ id: number }[]>('SELECT id FROM roles WHERE name = ? LIMIT 1', [role]);
    if (!roleRows?.length) {
      return NextResponse.json({ message: `Rôle inconnu: ${role}` }, { status: 400 });
    }

    const directionRows = await query<{ id: number }[]>('SELECT id FROM directions WHERE code = ? LIMIT 1', [direction]);
    if (!directionRows?.length) {
      return NextResponse.json({ message: `Direction inconnue: ${direction}` }, { status: 400 });
    }

    const existingUsers = await query<{ id: number }[]>('SELECT id FROM users WHERE email = ? LIMIT 1', [normalizedEmail]);
    if (existingUsers?.length) {
      return NextResponse.json({ message: 'Un utilisateur avec cet email existe déjà.' }, { status: 409 });
    }

    const insertUserResult: any = await query('INSERT INTO users (email, password_hash, full_name, is_active) VALUES (?, ?, ?, TRUE)', [normalizedEmail, passwordHash, fullName]);
    const userId = insertUserResult.insertId;

    await query(
      'INSERT INTO user_direction_mappings (user_id, direction_id, role_id, assigned_at) VALUES (?, ?, ?, NOW())',
      [userId, directionRows[0].id, roleRows[0].id],
    );

    return NextResponse.json({ ok: true, userId });
  } catch (err: any) {
    console.error('API /api/admin/users error', err);
    return NextResponse.json({ message: err?.message || 'Erreur serveur' }, { status: 500 });
  }
}
