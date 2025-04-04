export type AccountType = "PERSONAL" | "SHARED";

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  createdAt: Date;
  updatedAt: Date;
}
