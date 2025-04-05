import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/authTypes";

type RoleConfig = { [role: string]: { strict?: boolean } } | string;

export const authorizeRoles = (...roles: RoleConfig[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    const userRole = req.user?.role;
    const userId = req.user?.id;

    const roleMap: Record<string, boolean> = roles.reduce((acc, role) => {
      if (typeof role === "string") acc[role] = false;
      else {
        const roleName = Object.keys(role)[0];
        acc[roleName] = role[roleName].strict || false;
      }
      return acc;
    }, {} as Record<string, boolean>);

    if (userRole && roleMap[userRole] !== undefined) {
      return next();
    }

    res.status(403).json({ message: "Forbidden: Unauthorized role." });
  };
};
