import crypto from 'crypto';

export const generateOTP = (length = 6): string => {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const bytes = crypto.randomBytes(length);
  return Array.from(bytes, byte => charset[byte % charset.length]).join('');
};

// export const generateOTP = (): string => {
//     return Math.floor(100000 + Math.random() * 900000).toString();
//   };