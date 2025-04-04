import prisma from "../models/prismaClient"; // Import your database connection
import { IUser } from "../types/userTypes"; // Import your User type

export const getUserById = async (id: string): Promise<IUser | null> => {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  return user || null;
};
