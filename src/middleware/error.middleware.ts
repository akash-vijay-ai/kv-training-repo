import { NextFunction, Request, Response } from "express";
import HttpException from "../exeption/http.excption";

const errorMiddleware = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (error instanceof HttpException) {
            const status: number = error.status || 500;
            const message: string = error.message || "Something went wrong";
            let respbody = { message: message };
            res.status(status).json(respbody);
        } else {
            console.error(error.stack);
            res.status(500).send({ error: error.message });
        }
    } catch (error) {
        next(error);
    }
};

export default errorMiddleware;
