
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbHost = process.env.DB_HOST || 'localhost';
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || '';
const dbPort = parseInt(process.env.DB_PORT || '3306');
const dbName = process.env.DB_NAME || 'myappdb';

(async () => {
    try {
        const connection = await mysql.createConnection({
            host: dbHost,
            user: dbUser,
            password: dbPassword,
            port: dbPort,
        });

        console.log(`🔌 Connected to MySQL at ${dbHost}:${dbPort}`);

        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
        console.log(`✅ Database '${dbName}' created or already exists.`);

        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating database:', error);
        process.exit(1);
    }
})();
