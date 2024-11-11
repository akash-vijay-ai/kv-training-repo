import { Request } from "express";
import { Role } from "./role.enum";

export interface RequestWithUser extends Request {
    name: string;
    role: Role;
    email: string;
}
