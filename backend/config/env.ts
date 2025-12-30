

import dotenv from 'dotenv';

dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
export const EMAIL_SERVICE=process.env.EMAIL_SERVICE 
export const EMAIL_USER =process.env.EMAIL_USER
export const EMAIL_PASS = process.env.EMAIL_PASS 
export const EMAIL_FROM = process.env.EMAIL_FROM 