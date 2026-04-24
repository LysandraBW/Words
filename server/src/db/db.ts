import postgres from 'postgres';
import 'dotenv/config';

const db = postgres({
    host: process.env.HOST || '',
    port: Number(process.env.PORT || ''),
    database: process.env.DATABASE || '',
    username: process.env.DB_USERNAME || '',
    password: process.env.DB_PASSWORD || ''
});

export default db;