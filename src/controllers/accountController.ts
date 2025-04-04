import { Request, Response } from "express";
import prisma from "../models/prismaClient";
import { IAccount } from "../types/accountTypes";
import { sendResponse } from "../utils/responseHelper";
import { AuthRequest } from "../types/authTypes";

export const getAccounts = async (req: Request, res: Response) => {
  try {
    const accounts: IAccount[] = await prisma.account.findMany({
      select: {
        id: true,
        name: true,
        type: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    sendResponse(res, true, "Accounts fetched successfully", accounts);
  } catch (error) {
    sendResponse(res, false, "Failed to fetch accounts", null, 500);
  }
};

export const getAccountById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const account: IAccount | null = await prisma.account.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        type: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!account) sendResponse(res, false, "Account not found", null, 404);
    sendResponse(res, true, "Account fetched successfully", account);
  } catch (error) {
    sendResponse(res, false, "Failed to fetch account", null, 500);
  }
};

export const createAccount = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  if (!req.user?.id) {
    sendResponse(res, false, "Unauthorized", null, 401);
    return;
  }
  try {
    const { name, type } = req.body;
    const newAccount: IAccount = await prisma.account.create({
      data: {
        name,
        type,
      },
    });
    if (newAccount) {
      const userAccountRelation = await prisma.userAccount.create({
        data: {
          userId: req.user.id,
          accountId: newAccount.id,
          role: "OWNER", // create account must be owner, there wil be different for shared accounts or joining accounts
        },
      });
      if (!userAccountRelation) {
        return sendResponse(
          res,
          false,
          "Failed to create user-account relation",
          null,
          500
        );
      }
    }

    sendResponse(res, true, "Account created successfully", newAccount, 201);
  } catch (error) {
    sendResponse(res, false, "Failed to create account", null, 500);
  }
};
