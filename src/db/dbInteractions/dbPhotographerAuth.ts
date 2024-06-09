import { db, PhotographerType } from "../db";
import { eq, and } from 'drizzle-orm';

interface photographerInfo {
    id: number,
    login: string,
    fullname: string
}

export async function checkPhotographersCreds(login: string, password: string): Promise<0 | 1> {
    const userInfo = await db.db.select()
        .from(db.photographers)
        .where(and(eq(db.photographers.login, login), eq(db.photographers.password, password)));
    if (userInfo.length > 0) {
        return 1;
    }
    return 0;
}

export async function getPhotographerInfo(login: string): Promise<photographerInfo> {
    const userInfo = await db.db.select({ id: db.photographers.id, login: db.photographers.login, fullname: db.photographers.fullname })
        .from(db.photographers)
        .where(eq(db.photographers.login, login));
    return userInfo[0];
}