import { db } from "../db";

export async function insertNewPhoto(albumId: number, url: string, clients: string): Promise<void> {
    await db.db.insert(db.photos).values({ albumId, url, clients });
}

