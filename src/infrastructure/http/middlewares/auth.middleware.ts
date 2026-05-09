import { Request, Response, NextFunction } from 'express';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'supersecretkey');

export interface AuthRequest extends Request {
  user?: {
    id: number;
    uuid: string;
    tenantId: number;
    roleId: number;
  };
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    req.user = {
      id: payload.id as number,
      uuid: payload.uuid as string,
      tenantId: payload.tenantId as number,
      roleId: payload.roleId as number,
    };
    
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid token' });
  }
};
