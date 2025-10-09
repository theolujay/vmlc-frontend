export function maskEmail(email: string) {
  const [name, domain] = email.split('@');
  if (name.length <= 4) return email;
  const maskedName = name.slice(0, 3) + '...' + name.slice(-2);
  return `${maskedName}@${domain}`;
}

