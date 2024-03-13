import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const { PG_HOST, PG_PORT, PG_USER, PG_PASSWORD, PG_DATABASE } = process.env;

export const pool = new Pool({
    host: PG_HOST,
    port: +PG_PORT!,
    user: PG_USER,
    password: PG_PASSWORD,
    database: PG_DATABASE,
});
