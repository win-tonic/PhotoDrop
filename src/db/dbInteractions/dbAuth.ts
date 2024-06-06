import { db } from "../db";
import { eq, and } from 'drizzle-orm';

export async function checkPhotographersCreds(login: string, password: string): Promise<0 | 1> {
    const userInfo = await db.db.select()
        .from(db.photographers)
        .where(and(eq(db.photographers.login, login), eq(db.photographers.password, password)));
    if (userInfo.length > 0) {
        return 1;
    }
    return 0;
}

//TYPIFY RETURN WITH INTERFACE
export async function getPhotogrpherInfo(login: string){
    const userInfo = await db.db.select()
        .from(db.photographers)
        .where(eq(db.photographers.login, login))
    return userInfo
}