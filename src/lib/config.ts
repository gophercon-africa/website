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

const parseBoolean = (value: string | undefined, defaultValue: boolean): boolean => {
  if (value === undefined || value.trim() === '') {
    return defaultValue;
  }
  return value.trim().toLowerCase() === 'true';
};

export const REVIEWER_EMAILS = parseEmailList(process.env.REVIEWER_EMAILS);
export const ADMIN_EMAILS = parseEmailList(process.env.ADMIN_EMAILS);
export const OTP_EXPIRY_MINUTES = parsePositiveInt(process.env.OTP_EXPIRY_MINUTES, 10);
export const SESSION_EXPIRY_DAYS = parsePositiveInt(process.env.SESSION_EXPIRY_DAYS, 3);

// Whether the Call for Speakers is accepting submissions. Defaults to closed;
// set CALL_FOR_SPEAKERS_OPEN=true to reopen.
export const CALL_FOR_SPEAKERS_OPEN = parseBoolean(process.env.CALL_FOR_SPEAKERS_OPEN, false);

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
