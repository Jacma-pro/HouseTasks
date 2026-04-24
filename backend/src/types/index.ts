import { Request } from 'express';

export interface AuthUser {
  id: string;
  email: string;
}

export interface AuthRequest extends Request {
  user: AuthUser;
}

export interface AppError extends Error {
  statusCode?: number;
}
