import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class OtpService {
  // Temporary in-memory OTP store (use Redis for production)
  private otpStore: Map<string, { otp: string; expiresAt: number }> = new Map();

  generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async sendOtp(email: string): Promise<void> {
    const otp = this.generateOtp();

    this.otpStore.set(email, {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
    });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'ZonePortal — Your OTP Code',
      html: `
        <div style="font-family: Arial; max-width: 400px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #16a34a;">🌿 ZonePortal</h2>
          <p>Your OTP verification code is:</p>
          <h1 style="letter-spacing: 8px; color: #16a34a;">${otp}</h1>
          <p style="color: #888; font-size: 12px;">This code expires in 5 minutes.</p>
        </div>
      `,
    });
  }

  verifyOtp(email: string, otp: string): boolean {
    const record = this.otpStore.get(email);
    if (!record) return false;
    if (Date.now() > record.expiresAt) {
      this.otpStore.delete(email);
      return false;
    }
    if (record.otp !== otp) return false;
    this.otpStore.delete(email);
    return true;
  }
}
