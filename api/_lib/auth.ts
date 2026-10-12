import jwt from 'jsonwebtoken';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export function requireAdmin(req: VercelRequest, res: VercelResponse): boolean {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'No token provided' });
    return false;
  }

  try {
    jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET || '');
    return true;
  } catch {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
    return false;
  }
}