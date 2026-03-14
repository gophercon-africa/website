import * as React from 'react';

interface OtpEmailProps {
  otp: string;
  expiresInMinutes: number;
}

export function OtpEmail({ otp, expiresInMinutes }: OtpEmailProps) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ color: '#006B3F' }}>GopherCon Africa — Sign-In Code</h2>
      <p>Use the code below to sign in to the review dashboard:</p>
      <div style={{
        background: '#f4f4f4',
        borderRadius: '8px',
        padding: '24px',
        textAlign: 'center',
        margin: '24px 0',
      }}>
        <span style={{
          fontSize: '48px',
          fontWeight: 'bold',
          letterSpacing: '12px',
          color: '#006B3F',
          fontFamily: 'monospace',
        }}>
          {otp}
        </span>
      </div>
      <p>This code expires in <strong>{expiresInMinutes} minutes</strong>.</p>
      <p style={{ color: '#666', fontSize: '14px' }}>
        If you did not request this code, please ignore this email.
      </p>
      <p>Best regards,<br />The GopherCon Africa Team</p>
    </div>
  );
}
