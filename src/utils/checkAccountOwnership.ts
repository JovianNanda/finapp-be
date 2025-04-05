// utils/checkOwnership.ts
import prisma from "../models/prismaClient";

export const checkAccountOwnership = async (
  accountId: string,
  userId: string
): Promise<boolean> => {
  const userAccount = await prisma.userAccount.findUnique({
    where: {
      userId_accountId: {
        userId,
        accountId,
      },
    },
    select: {
      role: true,
    },
  });

  return !!userAccount && userAccount.role === "OWNER";
};
