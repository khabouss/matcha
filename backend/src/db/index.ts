// db.ts
import { Pool } from 'pg';
import dotenv from 'dotenv';
import { createUserSchema } from './userSchema';

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Central function to create all schemas
export const createSchemas = async () => {
    await createUserSchema();
};

export default pool;
