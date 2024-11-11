import { NextFunction, Request, Response } from "express";

const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    res.on("finish", () => {
        const statusCode = res.statusCode;
        if (statusCode >= 500) {
            console.error(
                `\x1b[31m[ERROR]\x1b[0m [${new Date().toISOString()}] ${
                    req.method
                } ${req.url}`
            );
        } else if (statusCode >= 400) {
            console.warn(
                `\x1b[33m[WARN]\x1b[0m [${new Date().toISOString()}] ${
                    req.method
                } ${req.url}`
            );
        } else if (statusCode >= 200) {
            console.log(
                `\x1b[32m[INFO]\x1b[0m [${new Date().toISOString()}] ${
                    req.method
                } ${req.url}`
            );
        }
    });

    next();
};

export default loggerMiddleware;
