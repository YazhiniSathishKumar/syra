// import jwt, { SignOptions } from 'jsonwebtoken';
// import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/env';

// // export const generateToken = (userId: number): string => {
// //   const options: SignOptions = {
// //     expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'], // Safe cast
// //   };

// //   return jwt.sign({ id: userId }, JWT_SECRET, options);
// // };

// export const verifyToken = (token: string): any => {
//   return jwt.verify(token, JWT_SECRET);
// };

// export const generateToken = (payload: { id: number; role: string }): string => {
//   const options: SignOptions = {
//     expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
//   };

//   return jwt.sign(payload, JWT_SECRET, options);
// };



import jwt, { SignOptions } from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/env';

export const generateToken = (payload: { id: number; role: string }): string => {
  const options: SignOptions = {
    expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  };

  return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, JWT_SECRET);
};
