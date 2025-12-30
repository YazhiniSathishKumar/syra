import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();


const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST || 'localhost';

if (!dbName || !dbUser) {
  console.warn('⚠️  Warning: DB_NAME or DB_USER environment variables are missing.');
}

const sequelize = new Sequelize({
  database: dbName || 'bcbuzz_db',
  username: dbUser || 'root',
  password: dbPassword || '',
  host: dbHost,
  port: parseInt(process.env.DB_PORT || '3306'),
  dialect: 'mysql',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
});

export default sequelize;