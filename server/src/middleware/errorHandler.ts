import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(err.stack);
  res.status(500).json({
    error: `[ERROR] Req: ${req}\nRes: ${res}\nNext: ${next}\nMessage: ${err} !!!`,
  });
};
