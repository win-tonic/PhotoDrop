import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();

const SECRET_KEY = process.env.PHOTOGRAPHERS_SECRET_KEY as string;

const verifyToken = (token: string): string | jwt.JwtPayload | undefined => {
    try {
        return jwt.verify(token, SECRET_KEY);
    } catch (err) {
        return undefined;
    }
};

const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ status: 401, message: 'No token provided' });
    }
    const decoded = verifyToken(token);
    if (!decoded) {
        return res.status(401).json({ status: 401, message: 'Invalid token' });
    }
    next();
};

const needsToken = (controller: (req: Request, res: Response) => void) => {
    return (req: Request, res: Response) => {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ status: 401, message: 'No token provided' });
        }
        const decoded = verifyToken(token);
        if (!decoded) {
            return res.status(401).json({ status: 401, message: 'Invalid token' });
        }
        res.locals = {...res.locals, tokenInfo: decoded}
        controller(req, res);
    };
};



export {verifyToken, authenticate, needsToken}