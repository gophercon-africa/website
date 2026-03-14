const parseEmailList = (envVar: string | undefined, name: string): string[] => {
  if (!envVar || envVar.trim() === '') {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`${name} environment variable must be configured`);
    }
    return [];
  }
  return envVar.split(',').map((e) => e.trim().toLowerCase()).filter(Boolean);
};

export const REVIEWER_EMAILS = parseEmailList(process.env.REVIEWER_EMAILS, 'REVIEWER_EMAILS');
export const ADMIN_EMAILS = parseEmailList(process.env.ADMIN_EMAILS, 'ADMIN_EMAILS');
export const OTP_EXPIRY_MINUTES = parseInt(process.env.OTP_EXPIRY_MINUTES ?? '10', 10);
export const SESSION_EXPIRY_DAYS = parseInt(process.env.SESSION_EXPIRY_DAYS ?? '3', 10);

export function isAuthorizedEmail(email: string): boolean {
  const normalized = email.toLowerCase();
  return REVIEWER_EMAILS.includes(normalized) || ADMIN_EMAILS.includes(normalized);
}

export function getEmailRole(email: string): 'reviewer' | 'admin' | null {
  const normalized = email.toLowerCase();
  if (ADMIN_EMAILS.includes(normalized)) return 'admin';
  if (REVIEWER_EMAILS.includes(normalized)) return 'reviewer';
  return null;
}
