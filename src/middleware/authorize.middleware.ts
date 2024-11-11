import { NextFunction, Request, Response } from "express";
import { RequestWithUser } from "../utils/requestWithUser";
import jsonwebtoken from "jsonwebtoken";
import { JWT_SECRET } from "../utils/constants";
import { jwtPayload } from "../utils/jwtPayload";

const authorize = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = getTokenFromRequestHeader(req);
        const payload = jsonwebtoken.verify(token, process.env.JWT_SECRET);
        
        req.name = (payload as jwtPayload).name;
        req.role = (payload as jwtPayload).role;
        req.email = (payload as jwtPayload).email;

        return next();
    } catch (error) {
        next(error);
    }
};

const getTokenFromRequestHeader = (req: RequestWithUser) => {
    const bearerToken = req.header("Authorization");

    const token = bearerToken ? bearerToken.replace("Bearer ", "") : "";
    return token;
};

export default authorize;
