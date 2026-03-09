import mysql from 'mysql2/promise';

// DB connection helper using mysql2/promise
// Defaults point to the requested host/database but credentials should come from env
const DB_HOST = process.env.DB_HOST || '41.79.235.70';
const DB_PORT = Number(process.env.DB_PORT || 3306);
const DB_USER = process.env.DB_USER || 'cccz_user';
const DB_PASS = process.env.DB_PASS || '';
const DB_NAME = process.env.DB_NAME || 'ccclezoo_portail';

export const pool = mysql.createPool({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    namedPlaceholders: false,
});

export async function query<T = any>(sql: string, params?: any[]) {
    try {
        const [rows] = await pool.query<T[]>(sql, params);
        return rows;
    } catch (err: any) {
        // Extract common MySQL error properties for clearer logging
        const details = {
            code: err && err.code,
            errno: err && err.errno,
            sqlMessage: err && err.sqlMessage,
            sqlState: err && err.sqlState,
        };
        console.error('Database query failed', { sql, params, error: err, details });

        const msg = err && (err.message || err.sqlMessage || err.code)
            ? String(err.message || err.sqlMessage || err.code)
            : 'Unknown database error';

        // Throw with meaningful message so callers can surface it when appropriate
        throw new Error(`Database query failed: ${msg}`);
    }
}

export default pool;
