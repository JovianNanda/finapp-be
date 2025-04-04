import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt, { VerifyErrors, JwtPayload } from "jsonwebtoken";

const prisma = new PrismaClient();

const generateAccessToken = (
  userId: string,
  userName: string,
  role: string
) => {
  return jwt.sign(
    { id: userId, name: userName, role },
    process.env.JWT_SECRET!,
    {
      expiresIn: "15m",
    }
  );
};

const generateRefreshToken = (
  userId: string,
  userName: string,
  role: string
) => {
  return jwt.sign(
    { id: userId, name: userName, role },
    process.env.JWT_REFRESH_SECRET!,
    {
      expiresIn: "7d",
    }
  );
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const accessToken = generateAccessToken(user.id, user.name, user.role);
    const refreshToken = generateRefreshToken(user.id, user.name, user.role);

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ message: "Login successful", accessToken, refreshToken });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
      res.status(401).json({ message: "Unauthorized: No refresh token" });
      return;
    }

    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!,
      async (
        err: VerifyErrors | null,
        decoded: JwtPayload | string | undefined
      ) => {
        if (err || !decoded || typeof decoded === "string") {
          res.status(403).json({ message: "Invalid refresh token" });
          return;
        }

        const user = await prisma.user.findUnique({
          where: { id: (decoded as jwt.JwtPayload).id },
        });

        if (!user) {
          res.status(403).json({ message: "User not found" });
          return;
        }

        const newAccessToken = generateAccessToken(
          user.id,
          user.name,
          user.role
        );

        res.cookie("access_token", newAccessToken, {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: 15 * 60 * 1000,
        });
        res.json({ message: "Token refreshed", accessToken: newAccessToken });
      }
    );
  } catch (error) {
    next(error);
  }
};
export const logout = (req: Request, res: Response) => {
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");
  res.json({ message: "Logged out successfully" });
};
