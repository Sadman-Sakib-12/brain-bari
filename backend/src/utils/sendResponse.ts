import { Response } from 'express';

interface IMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface IApiResponse<T> {
  statusCode: number;
  success: boolean;
  message?: string | null;
  meta?: IMeta;
  data?: T | null;
}

export const sendResponse = <T>(res: Response, data: IApiResponse<T>): void => {
  res.status(data.statusCode).json({
    success: data.success,
    statusCode: data.statusCode,
    message: data.message || 'Operation successful',
    meta: data.meta || null,
    data: data.data !== undefined ? data.data : null,
  });
};

export default sendResponse;
