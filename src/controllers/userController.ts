import { Request, Response } from "express";
import prisma from "../models/prismaClient";
import { sendResponse } from "../utils/responseHelper";
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
    sendResponse(res, true, "Users fetched successfully", users);
  } catch (error) {
    sendResponse(res, false, "Failed to fetch users", null, 500);
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
      return sendResponse(res, false, "User not found", null, 404);
    }
    sendResponse(res, true, "User fetched successfully", user);
  } catch (error) {
    sendResponse(res, false, "Failed to fetch user", null, 500);
  }
};

export const getUserWithAccounts = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const userWithAccounts = await prisma.user.findUnique({
      where: { id },
      include: {
        accounts: {
          include: {
            account: true, // Fetch full account details
          },
        },
      },
    });

    sendResponse(
      res,
      true,
      "User with accounts fetched successfully",
      userWithAccounts
    );
  } catch (error) {
    sendResponse(res, false, "Failed to fetch user with accounts", null, 500);
  }
};
