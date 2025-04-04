import prisma from "../models/prismaClient";
import { IUser } from "../types/userTypes";

export const getUserById = async (id: string): Promise<IUser | null> => {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  return user || null;
};
