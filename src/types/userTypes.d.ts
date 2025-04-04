export interface IUser {
  id: string;
  name: string;
  email: string;
  password?: string; // Make it optional when returning users
  createdAt: Date;
  updatedAt: Date;
}
