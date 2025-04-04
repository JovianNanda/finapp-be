import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt, { VerifyErrors, JwtPayload } from "jsonwebtoken";
import { sendResponse } from "../utils/responseHelper";

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
      sendResponse(res, false, "All fields are required", null, 400);
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

    sendResponse(res, true, "User registered successfully", user);
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
      sendResponse(res, false, "Email and password are required", null, 400);
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      sendResponse(res, false, "Invalid credentials", null, 401);
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

    const data = {
      accessToken,
      refreshToken,
    };
    sendResponse(res, true, "Login successful", data);
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
      sendResponse(res, false, "No refresh token provided", null, 401);
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
          sendResponse(res, false, "Invalid refresh token", null, 403);
          return;
        }

        const user = await prisma.user.findUnique({
          where: { id: (decoded as jwt.JwtPayload).id },
        });

        if (!user) {
          sendResponse(res, false, "User not found", null, 403);
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
        sendResponse(
          res,
          true,
          "Token refreshed successfully",
          { accessToken: newAccessToken },
          200
        );
      }
    );
  } catch (error) {
    next(error);
  }
};
export const logout = (req: Request, res: Response) => {
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");
  sendResponse(res, true, "Logged out successfully", null, 200);
};
