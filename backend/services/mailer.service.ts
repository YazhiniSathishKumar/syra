import nodemailer from 'nodemailer';
import { EMAIL_SERVICE, EMAIL_USER, EMAIL_PASS, EMAIL_FROM } from '../config/env';

const transporter = nodemailer.createTransport({
  service: EMAIL_SERVICE,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});

export const sendVerificationEmail = async (email: string, otp: string) => {
  try {
    await transporter.sendMail({
      from: EMAIL_FROM,
      to: email,
      subject: 'Verify Your Email',
      html: `<h2>Your OTP is: <strong>${otp}</strong></h2>`
    });
    console.log(`Email sent to ${email} with OTP: ${otp}`);
  } catch (error) {
    console.log('Email sending failed (development mode):', error);
    // In development, continue without email to avoid blocking the flow
  }
};