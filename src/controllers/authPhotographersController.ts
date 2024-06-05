import jwt from 'jsonwebtoken'
import { db } from '../db/db'
import { eq, and } from 'drizzle-orm';

const SECRET_KEY = 'secretkeyforphotographerslol';

const generateToken = (userId: number): string => {
    return jwt.sign({ id: userId }, SECRET_KEY, { expiresIn: '1d' });
};

//TUT CHEKNI TIPIZAZIYU returna
const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, SECRET_KEY);
    } catch (err) {
        return null;
    }
};

//TUT TOZHE
async function authPhotographersController(login: string, password: string) {
    const userInfo = await db.db.select()
        .from(db.photographers)
        .where(and(eq(db.photographers.login, login), eq(db.photographers.password, password)))
    if (userInfo.length > 0) {
        return generateToken(userInfo[0].id)
    }
    return null 
};

export { authPhotographersController, verifyToken}