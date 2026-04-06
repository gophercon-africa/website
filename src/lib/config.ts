const parseEmailList = (envVar: string | undefined): string[] => {
  if (!envVar || envVar.trim() === '') {
    return [];
  }
  return envVar.split(',').map((e) => e.trim().toLowerCase()).filter(Boolean);
};

const parsePositiveInt = (value: string | undefined, defaultValue: number): number => {
  const parsed = parseInt(value ?? String(defaultValue), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : defaultValue;
};

export const REVIEWER_EMAILS = parseEmailList(process.env.REVIEWER_EMAILS);
export const ADMIN_EMAILS = parseEmailList(process.env.ADMIN_EMAILS);
export const OTP_EXPIRY_MINUTES = parsePositiveInt(process.env.OTP_EXPIRY_MINUTES, 10);
export const SESSION_EXPIRY_DAYS = parsePositiveInt(process.env.SESSION_EXPIRY_DAYS, 3);

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
