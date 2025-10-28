import { getServerSession } from 'next-auth/next';
import { authOptions } from '../app/api/auth/[...nextauth]/route';

export async function getServerAuthSession() {
  return await getServerSession(authOptions as any);
}

export function isAllowedEmail(email?: string) {
  if (!email) return false;
  const allowedEmails = (process.env.ALLOWED_EMAILS || '').split(',').map(s => s.trim()).filter(Boolean);
  if (allowedEmails.length && allowedEmails.includes(email)) return true;
  const allowedDomains = (process.env.ALLOWED_DOMAINS || '').split(',').map(s => s.trim()).filter(Boolean);
  if (allowedDomains.length) {
    const domain = email.split('@')[1] || '';
    if (allowedDomains.includes(domain)) return true;
  }
  // if no allow-lists defined, treat as allowed
  if (!allowedEmails.length && !allowedDomains.length) return true;
  return false;
}
