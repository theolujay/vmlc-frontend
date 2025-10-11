

export function maskEmail(email?: string | null) {
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return ''; 
  }

  const [name, domain] = email.split('@');
  if (name.length <= 4) return email;
const maskedName=name.slice(0,3)+'...'
  // const maskedName = name.slice(0, 3) + '...' + name.slice(-2);
  return `${maskedName}@${domain}`;
}
