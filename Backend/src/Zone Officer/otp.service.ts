import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class OtpService {
    // Temporary storage for OTPs
    private otpStore: Map<string, { otp: string; expiresAt: number }> = new Map();

    // Generate 6-digit OTP
    generateOtp(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    // Send OTP to email
    async sendOtp(email: string): Promise<void> {
        const otp = this.generateOtp();

        // Save OTP with 5 minute expiry
        this.otpStore.set(email, {
            otp,
            expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
        });

        // Setup Gmail transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,     // your gmail
                pass: process.env.GMAIL_PASSWORD, // your app password
            },
        });

        // Send email
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

    // Verify OTP
    verifyOtp(email: string, otp: string): boolean {
        const record = this.otpStore.get(email);

        if (!record) return false;
        if (Date.now() > record.expiresAt) {
            this.otpStore.delete(email);
            return false;
        }
        if (record.otp !== otp) return false;

        // Delete OTP after successful verification
        this.otpStore.delete(email);
        return true;
    }
}