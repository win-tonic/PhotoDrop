//NE ZABUD POMIENYAT NA ENV VARS POTOM PZH
//i parol po heshu sravivat i hranit tolko hash, ne pozorsya (na retoole pohodu kak-to tozhe meniai hz)

import jwt from 'jsonwebtoken'
import { db } from '../db/db'
import { eq, and } from 'drizzle-orm';

const SECRET_KEY = 'secretkeyforphotographerslol';

const generateToken = (userId: number): string => {
    return jwt.sign({ id: userId }, SECRET_KEY, { expiresIn: '1d' });
};

const verifyToken = (token: string): string | jwt.JwtPayload | undefined => {
    try {
        return jwt.verify(token, SECRET_KEY);
    } catch (err) {
        return undefined;
    }
};

async function authPhotographersController(login: string, password: string): Promise<string | undefined> {
    const userInfo = await db.db.select()
        .from(db.photographers)
        .where(and(eq(db.photographers.login, login), eq(db.photographers.password, password)))
    if (userInfo.length > 0) {
        return generateToken(userInfo[0].id)
    }
    return undefined
};

export { authPhotographersController, verifyToken}