//NE ZABUD POMIENYAT NA ENV VARS POTOM PZH

import jwt, { JwtPayload } from 'jsonwebtoken'
import { db } from '../db/db'
import { eq, and } from 'drizzle-orm';

const SECRET_KEY = 'secretkeyforphotographerslol';

const generateToken = (userId: number): string => {
    return jwt.sign({ id: userId }, SECRET_KEY, { expiresIn: '1d' });
};

const verifyToken = (token: string): string | jwt.JwtPayload | null => {
    try {
        return jwt.verify(token, SECRET_KEY);
    } catch (err) {
        return null;
    }
};

async function authPhotographersController(login: string, password: string): Promise<string | null> {
    const userInfo = await db.db.select()
        .from(db.photographers)
        .where(and(eq(db.photographers.login, login), eq(db.photographers.password, password)))
    if (userInfo.length > 0) {
        return generateToken(userInfo[0].id)
    }
    return null 
};

export { authPhotographersController, verifyToken}