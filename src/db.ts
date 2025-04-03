import { Pool } from "pg";
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT),
});

async function connectToDb() {
    try {
        await pool.connect();
        console.log('Successfully connected to the database');
    } catch (err: any) {
        console.error('Failed to connect to the database:', err.message);
        process.exit(1);
    }
}

connectToDb();

export default pool;