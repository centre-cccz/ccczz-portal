/**
 * Prisma bridge replaced with mysql pool for now.
 * Exports `prisma` as a mysql2 pool-compatible object so existing imports continue to work.
 */
import pool, { query, pool as mysqlPool } from './db';

// Export an object named `prisma` for compatibility with existing imports.
export const prisma = {
    pool: mysqlPool,
    query,
};

export default prisma;
