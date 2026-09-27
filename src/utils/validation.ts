export function normalizeEmail(email: string): string {
  return (email || '').trim().toLowerCase();
}

export function isValidEmail(email: string): boolean {
  const norm = normalizeEmail(email);
  if (!norm) return false;
  // Standard RFC 5322 compatible email pattern
  const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return re.test(norm);
}

export function areEmailsEqual(emailA: string, emailB: string): boolean {
  return normalizeEmail(emailA) === normalizeEmail(emailB);
}
