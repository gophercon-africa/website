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

const parseDate = (value: string | undefined): Date | null => {
  if (!value || value.trim() === '') {
    return null;
  }
  const parsed = new Date(value.trim());
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

// ISO timestamp (with explicit UTC offset) after which reviewer sign-in and
// review reads/writes are refused. Unset or invalid means reviews stay open.
export const REVIEW_DEADLINE = parseDate(process.env.REVIEW_DEADLINE);

// A function, not a module-scope boolean: Workers isolates are long-lived, so
// a value computed at cold start would never cross the deadline.
export function isReviewPeriodOpen(): boolean {
  return REVIEW_DEADLINE === null || new Date() < REVIEW_DEADLINE;
}

