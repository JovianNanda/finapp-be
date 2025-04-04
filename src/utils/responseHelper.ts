import { Response } from "express";

interface ResponseData<T> {
  success: boolean;
  message: string;
  data?: T;
}

export const sendResponse = <T>(
  res: Response,
  success: boolean,
  message: string,
  data?: T,
  statusCode: number = success ? 200 : 400
) => {
  const response: ResponseData<T | null> = {
    success,
    message,
    data: success ? data : null,
  };
  res.status(statusCode).json(response);
};
