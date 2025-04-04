import { Request, Response } from "express";
import prisma from "../models/prismaClient";
import { errorResponse, successResponse } from "../utils/responseHelper";
import bcrypt from "bcrypt"; // Import bcrypt for password hashing
import { IUser } from "../types/userTypes";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users: IUser[] = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    successResponse(res, users, "Users fetched successfully");
  } catch (error) {
    errorResponse(res, "Failed to fetch users", 500);
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user: IUser | null = await prisma.user.findUnique({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
      where: { id },
    });
    if (!user) {
      return errorResponse(res, "User not found", 404);
    }
    successResponse(res, user, "User fetched successfully");
  } catch (error) {
    errorResponse(res, "Failed to fetch user", 500);
  }
};
