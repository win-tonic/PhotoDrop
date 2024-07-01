import { db, PhotographerType } from "../db";
import { eq, and } from 'drizzle-orm';

interface photographerInfo {
    id: number,
    login: string,
    fullname: string
}

export async function checkPhotographersCreds(login: string, password: string): Promise<boolean> {
    const userInfo = await db.db.select()
        .from(db.photographers)
        .where(and(eq(db.photographers.login, login), eq(db.photographers.password, password)));
    if (userInfo.length > 0) {
        return true;
    }
    return false;
}

export async function getPhotographerInfo(login: string): Promise<photographerInfo> {
    const userInfo = await db.db.select({ id: db.photographers.id, login: db.photographers.login, fullname: db.photographers.fullname })
        .from(db.photographers)
        .where(eq(db.photographers.login, login));
    return userInfo[0];
}

export async function getHashedPassword(login: string): Promise<string> {
    const userInfo = await db.db.select({ password: db.photographers.password })
        .from(db.photographers)
        .where(eq(db.photographers.login, login));
    return userInfo[0].password;
}

export async function addPhotographer(login: string, password: string, fullname: string, email: string): Promise<photographerInfo> {
    return (await db.db.insert(db.photographers).values({
        login: login,
        password: password,
        fullname: fullname,
        email: email
    }).returning({
        id: db.photographers.id,
        login: db.photographers.login,
        fullname: db.photographers.fullname
    }))[0]
}