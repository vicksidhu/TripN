import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

type JwtPayload = {
  userId: string;
};

export interface AuthRequest extends Request {
  userId?: string;
}

export function protect(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  try {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith('Bearer ')) {
      res.status(401).json({
        message: 'Authentication required.',
      });
      return;
    }

    const token = authorization.split(' ')[1];

    if (!token) {
      res.status(401).json({
        message: 'Authentication required.',
      });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined.');
    }

    const decoded = jwt.verify(
      token,
      jwtSecret
    ) as JwtPayload;

    req.userId = decoded.userId;

    next();
  } catch (error) {
    res.status(401).json({
      message: 'Invalid or expired authentication token.',
    });
  }
}