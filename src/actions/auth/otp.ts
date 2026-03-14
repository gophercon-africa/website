'use server';

import { z } from 'zod';
import { db } from '@/src/db';
import { Resend } from 'resend';
import { generateOtp, hashOtp, verifyOtp } from '@/src/lib/otp';
import { OTP_EXPIRY_MINUTES, getEmailRole } from '@/src/lib/config';
import { OtpFormState } from '@/src/types/otp';
import { OtpEmail } from '@/src/notification/email/templates/otp-verification';

const sendOtpSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
});

export async function sendOtp(_: OtpFormState, formData: FormData): Promise<OtpFormState> {
  const result = sendOtpSchema.safeParse({
    email: formData.get('email'),
  });

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  const { email } = result.data;
  const normalizedEmail = email.toLowerCase().trim();

  const role = getEmailRole(normalizedEmail);
  if (!role) {
    return { errors: { email: ['Email not authorized'] } };
  }

  try {
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    const recentOtp = await db.otpToken.findFirst({
      where: {
        email: normalizedEmail,
        createdAt: { gte: oneMinuteAgo },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (recentOtp) {
      const remainingSeconds = Math.ceil((recentOtp.createdAt.getTime() + 60000 - Date.now()) / 1000);
      return { errors: { _form: [`Please wait ${remainingSeconds} seconds before requesting another code`] } };
    }

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const hourlyCount = await db.otpToken.count({
      where: {
        email: normalizedEmail,
        createdAt: { gte: oneHourAgo },
      },
    });

    if (hourlyCount >= 5) {
      return { errors: { _form: ['Too many OTP requests. Try again in an hour.'] } };
    }

    await db.otpToken.updateMany({
      where: {
        email: normalizedEmail,
        used: false,
      },
      data: { used: true },
    });

    const otp = generateOtp();
    const tokenHash = hashOtp(otp);
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await db.otpToken.create({
      data: {
        email: normalizedEmail,
        tokenHash,
        expiresAt,
        role,
      },
    });

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: 'hello@gophercon.africa',
      to: normalizedEmail,
      subject: 'GopherCon Africa — Sign-In Code',
      react: OtpEmail({ otp, expiresInMinutes: OTP_EXPIRY_MINUTES }),
    });

    if (error) {
      console.error('Resend error:', error);
      return { errors: { _form: ['Failed to send email. Please try again.'] } };
    }

    return { success: true };
  } catch (err: unknown) {
    console.error('sendOtp error:', err);
    if (err instanceof Error) {
      return { errors: { _form: [err.message] } };
    }
    return { errors: { _form: ['Failed to send code. Please try again.'] } };
  }
}

const verifyOtpSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  otp: z.string().length(6, { message: 'Code must be 6 digits' }).regex(/^\d+$/, { message: 'Code must be numeric' }),
});

export async function verifyOtpAction(_: OtpFormState, formData: FormData): Promise<OtpFormState> {
  const result = verifyOtpSchema.safeParse({
    email: formData.get('email'),
    otp: formData.get('otp'),
  });

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  const { email, otp } = result.data;
  const normalizedEmail = email.toLowerCase().trim();

  try {
    const otpRecord = await db.otpToken.findFirst({
      where: {
        email: normalizedEmail,
        used: false,
        expiresAt: { gte: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otpRecord) {
      return { errors: { _form: ['Invalid or expired code'] } };
    }

    // Increment attempts BEFORE checking (prevents timing oracle)
    await db.otpToken.update({
      where: { id: otpRecord.id },
      data: { attempts: { increment: 1 } },
    });

    // Check attempt limit (otpRecord.attempts is the value BEFORE increment)
    if (otpRecord.attempts >= 5) {
      await db.otpToken.update({
        where: { id: otpRecord.id },
        data: { used: true },
      });
      return { errors: { _form: ['Too many attempts. Request a new code.'] } };
    }

    // Verify OTP using constant-time comparison
    const isValid = verifyOtp(otp, otpRecord.tokenHash);
    if (!isValid) {
      return { errors: { _form: ['Incorrect code'] } };
    }

    await db.otpToken.update({
      where: { id: otpRecord.id },
      data: { used: true },
    });

    const role = otpRecord.role;
    const redirectUrl = role === 'admin' ? '/admin/dashboard' : '/reviews';

    return {
      success: true,
      redirectTo: redirectUrl,
    };
  } catch (err: unknown) {
    console.error('verifyOtpAction error:', err);
    if (err instanceof Error) {
      return { errors: { _form: [err.message] } };
    }
    return { errors: { _form: ['Verification failed. Please try again.'] } };
  }
}
