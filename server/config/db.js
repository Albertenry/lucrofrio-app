// server/config/db.js
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false, // ajuste conforme necessário
});

export const query = (text, params) => pool.query(text, params);
