import { db } from "../db";
import { eq } from 'drizzle-orm';

export async function insertNewPhoto(albumId: number, url: string, clients: string): Promise<void> {
    await db.db.insert(db.photos).values({ albumId, url, clients });
}

export async function getPhotoInfo(photoId: number): Promise<any> {
    return await db.db.select().from(db.photos).where(eq(db.photos.id, photoId));
}

export async function addClientsToPhoto(photoId: number, newClients: number[]): Promise<void> {
    let info = await getPhotoInfo(photoId)
    let oldClients = info ? JSON.parse(info.clients): []
    let resultingClients = [...oldClients, ...newClients]
    await db.db.update(db.photos).set({clients: JSON.stringify(resultingClients)}).where(eq(db.photos.id, photoId));
}

