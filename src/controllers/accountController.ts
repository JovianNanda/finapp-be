import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "../models/prismaClient";
import { Account } from "../types/accountTypes";
import { successResponse, errorResponse } from "../utils/responseHelper";

// Get all accounts (ADMIN only)
export const getAccounts = async (req: Request, res: Response) => {
  try {
    const accounts: Account[] = await prisma.account.findMany({
      select: {
        id: true,
        name: true,
        type: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    successResponse(res, accounts, "Accounts fetched successfully");
  } catch (error) {
    errorResponse(res, "Failed to fetch users", 500);
  }
};

// Get a single account by ID (Admin or the account owner)
export const getAccountById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const account: Account | null = await prisma.account.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        type: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!account) res.status(404).json({ message: "Account not found" });
    res.json(account);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const createAccount = async (req: Request, res: Response) => {
  try {
    const { name, type } = req.body;
    const newAccount: Account = await prisma.account.create({
      data: {
        name,
        type,
      },
    });
    successResponse(res, newAccount, "Account created successfully");
  } catch (error) {
    errorResponse(res, "Failed to create account", 500);
  }
};
