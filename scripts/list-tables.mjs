import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

const DB_HOST = process.env.DB_HOST || '41.79.235.70';
const DB_PORT = Number(process.env.DB_PORT || 3306);
const DB_USER = process.env.DB_USER || 'cccz_user';
const DB_PASS = process.env.DB_PASS || '';
const DB_NAME = process.env.DB_NAME || 'ccclezoo_portail';

(async () => {
    console.log(`Connecting to ${DB_USER}@${DB_HOST}:${DB_PORT}/${DB_NAME}`);
    try {
        const conn = await mysql.createConnection({
            host: DB_HOST,
            port: DB_PORT,
            user: DB_USER,
            password: DB_PASS,
            database: DB_NAME,
        });

        const [rows] = await conn.query("SHOW TABLES");
        console.log('Tables:');
        console.table(rows);

        await conn.end();
    } catch (err) {
        console.error('DB connection error:', err.message || err);
        process.exitCode = 2;
    }
})();
