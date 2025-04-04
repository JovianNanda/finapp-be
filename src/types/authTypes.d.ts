import { UserRole } from "@prisma/client";
import { Request } from "express";

export interface JwtPayload {
  id: string;
  name: string;
  role: UserRole;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}
