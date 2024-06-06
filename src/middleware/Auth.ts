import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const SECRET_KEY = 'secretkeyforphotographerslol';

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

export {verifyToken, authenticate}