// server/src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from "express";

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const errorMessage = `[ERROR] Req: ${req}\nRes: ${res}\nNext: ${next}\nMessage: ${err} !!!`;
    console.error(" #### GINASARUS: \n" + errorMessage);
    console.error(err.stack);
    res.status(500).json({
        error: errorMessage
    });
};
