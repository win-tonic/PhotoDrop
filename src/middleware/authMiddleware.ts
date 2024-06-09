import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();

const SECRET_KEY = process.env.PHOTOGRAPHERS_SECRET_KEY as string;
const CLIENT_SECRET_KEY = process.env.CLIENTS_SECRET_KEY as string;

const verifyToken = (token: string, key: string): string | jwt.JwtPayload | undefined => {
    try {
        return jwt.verify(token, key);
    } catch (err) {
        return undefined;
    }
};

const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ status: 401, message: 'No token provided' });
    }
    const decoded = verifyToken(token, SECRET_KEY);
    if (!decoded) {
        return res.status(401).json({ status: 401, message: 'Invalid token' });
    }
    next();
};

const needsPhotographerToken = (controller: (req: Request, res: Response, next: NextFunction) => void) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers.authorization?.split(' ')[1] || req.headers.authorization;
        if (!token) {
            return res.status(401).json({ status: 401, message: 'No token provided' });
        }
        const decoded = verifyToken(token, SECRET_KEY);
        if (!decoded) {
            return res.status(401).json({ status: 401, message: 'Invalid token' });
        }
        res.locals = {...res.locals, tokenInfo: decoded}
        controller(req, res, next);
    };
};

const needsClientToken = (controller: (req: Request, res: Response, next: NextFunction) => void) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers.authorization?.split(' ')[1] || req.headers.authorization;
        if (!token) {
            return res.status(401).json({ status: 401, message: 'No token provided' });
        }
        const decoded = verifyToken(token, CLIENT_SECRET_KEY);
        if (!decoded) {
            return res.status(401).json({ status: 401, message: 'Invalid token' });
        }
        res.locals = {...res.locals, tokenInfo: decoded}
        controller(req, res, next);
    };
};



export {authenticate, needsPhotographerToken, needsClientToken}