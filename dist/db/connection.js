import dotenv from 'dotenv';
dotenv.config();
import pg from 'pg';
const { Pool } = pg;
const pool = new Pool({
    host: "localhost",
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    port: 5432,
});
export { pool };
