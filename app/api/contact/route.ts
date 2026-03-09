import { NextResponse } from 'next/server';
import { withAuth } from '../../../lib/withAuth';

// Public contact endpoint — allows PUBLIC, NO DIRECTION CHECK (external form)
export const POST = withAuth(async (request: Request) => {
  try {
    const data = await request.json();
    const { name, email, message } = data as { name?: string; email?: string; message?: string };

    // Validation strictly public: name, email, message only
    // NO direction_owner field accepted from public form
    if (!name || !email) {
      return NextResponse.json({ ok: false, error: 'name and email required' }, { status: 400 });
    }

    // Email format validation (basic)
    if (!email.includes('@') || email.length < 5) {
      return NextResponse.json({ ok: false, error: 'invalid email format' }, { status: 400 });
    }

    // Message length validation (XSS protection)
    if (message && message.length > 5000) {
      return NextResponse.json({ ok: false, error: 'message too long (max 5000 chars)' }, { status: 400 });
    }

    const DB_HOST = process.env.DB_HOST;
    if (DB_HOST) {
      try {
        const mysql = await import('mysql2/promise');
        const conn = await mysql.createConnection({
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT || 3306),
          user: process.env.DB_USER,
          password: process.env.DB_PASS,
          database: process.env.DB_NAME,
        });
        // Bind contact to default EXTERNAL direction (no user direction)
        const sql = 'INSERT INTO contacts (name, email, message, direction_owner) VALUES (?, ?, ?, ?)';
        await conn.execute(sql, [name, email, message || null, 'EXTERNAL']);
        await conn.end();
        return NextResponse.json({ ok: true, stored: 'db' });
      } catch (err) {
        console.error('DB insert error', err);
        // fallback to file storage on DB failure
      }
    }

    // Fallback: append to data/contacts.json (for local dev)
    const fs = await import('fs');
    const path = await import('path');
    const file = path.join(process.cwd(), 'data', 'contacts.json');
    const dir = path.dirname(file);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    let arr: any[] = [];
    if (fs.existsSync(file)) {
      try { arr = JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { arr = []; }
    }
    arr.push({ name, email, message, direction_owner: 'EXTERNAL', receivedAt: new Date().toISOString() });
    fs.writeFileSync(file, JSON.stringify(arr, null, 2));

    return NextResponse.json({ ok: true, stored: 'file' });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, error: 'server error' }, { status: 500 });
  }
}, { allowPublic: true });
