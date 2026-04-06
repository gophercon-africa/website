'use server';

import { z } from 'zod';
import { db } from '@/src/db';
import { Resend } from 'resend';
import { generateOtp, hashOtp } from '@/src/lib/otp';
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
