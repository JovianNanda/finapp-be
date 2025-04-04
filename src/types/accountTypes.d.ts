import { AccountType } from "@prisma/client";

export interface IAccount {
  id: string;
  name: string;
  type: AccountType;
  createdAt: Date;
  updatedAt: Date;
}
