import { Request } from "express";

export type UserRole = "USER" | "ADMIN";

export interface JwtPayload {
  id: string;
  name: string;
  role: UserRole;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}
