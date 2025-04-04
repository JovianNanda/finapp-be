// src/middleware/verifyToken.ts
import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest, UserRole } from "../types/authTypes"; // Your custom AuthRequest type

type RoleConfig = { [role: string]: { strict?: boolean } } | string;

export const verifyToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Unauthorized" }); // Send response on error
    return; // Don't continue, return here to avoid calling next
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      name: string;
      role: string;
    };
    req.user = {
      id: decoded.id,
      name: decoded.name,
      role: decoded.role as UserRole,
    }; // Assign decoded user data to the request object
    next(); // Call next to proceed to the next middleware/handler
  } catch (err) {
    res.status(403).json({ message: "Invalid token" }); // Send response on error
  }
};

export const authorizeRoles = (...roles: RoleConfig[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    const userRole = req.user?.role; // Logged-in user's role
    const userId = req.user?.id; // Logged-in user's ID
    const paramId = req.params.id; // The ID from the request URL

    // Convert roles into a structured object { roleName: strictMode }
    const roleMap: Record<string, boolean> = roles.reduce((acc, role) => {
      if (typeof role === "string") {
        acc[role] = false; // Default: strict is false
      } else {
        // Extract roleName and strict value from object
        const roleName = Object.keys(role)[0]; // Example: "USER"
        const strictValue = role[roleName].strict || false; // Default: false
        acc[roleName] = strictValue;
      }
      return acc;
    }, {} as Record<string, boolean>);

    // Check if the user has a valid role
    if (userRole && roleMap[userRole] !== undefined) {
      // If strict mode is enabled for USER, enforce self-access
      if (userRole === "USER" && roleMap[userRole] && userId !== paramId) {
        res
          .status(403)
          .json({ message: "Forbidden: Strict mode enforced, access denied." });
      }
      return next();
    }

    // Otherwise, return Forbidden response
    res.status(403).json({
      message: "Forbidden: You are not authorized to access this resource.",
    });
  };
};
