import { Request } from 'express';

export interface AuthenticatedUser {
  id: number;
  email: string;
  username: string;
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser | null;
} 