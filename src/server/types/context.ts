import { Request, Response } from "express";
import { User } from "../entities";
import { Server } from "socket.io";

declare global {
    namespace Express {
        export interface Request {
            user: User;
        }
    }
}

export type MyContext = {
    req: Request;
    res: Response;
};
