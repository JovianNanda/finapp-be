export interface IUser {
  id: string;
  name: string;
  email: string;
  password?: string; // optional
  createdAt: Date;
  updatedAt: Date;
}
