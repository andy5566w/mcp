import { pool } from '../db.js';
import { log } from './logger.js';

export async function checkDatabaseConnection(): Promise<void> {
    log('Checking database connection...');
    const conn = await pool.getConnection();
    try {
        await conn.ping(); // 測試連線
        log('Database connection OK');
    } catch (err) {
        log(`Database connection failed: ${err instanceof Error ? err.message : String(err)}`);
        if (err instanceof Error && err.message.includes('ECONNREFUSED')) {
            log('Database connection failed. Please check your .env file and ensure MySQL is running.');
        }
        throw err;
    } finally {
        conn.release();
    }
}
