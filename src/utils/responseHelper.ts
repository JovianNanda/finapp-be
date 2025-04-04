import { Response } from "express";

interface ResponseData<T> {
  success: boolean;
  message: string;
  data?: T;
}

export const successResponse = <T>(
  res: Response,
  data: T,
  message: string = "Request successful"
) => {
  const response: ResponseData<T> = {
    success: true,
    message,
    data,
  };
  res.status(200).json(response);
};

export const errorResponse = (
  res: Response,
  message: string = "An error occurred",
  statusCode: number = 400
) => {
  const response: ResponseData<null> = {
    success: false,
    message,
  };
  res.status(statusCode).json(response);
};
