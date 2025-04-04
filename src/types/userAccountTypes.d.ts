import { AccountRole } from "@prisma/client";

export interface IUserAccount {
  id: string;
  userId: string;
  accountId: string;
  role: AccountRole;
}
