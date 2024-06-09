import { db, PhotoType } from "../db";
import { eq, inArray } from 'drizzle-orm';

export async function insertNewPhoto(albumId: number, url: string, clients: string): Promise<void> {
    await db.db.insert(db.photos).values({ albumId, url, clients });
}

export async function getPhotoInfo(photoId: number): Promise<PhotoType> {
    const info = await db.db.select({
        id: db.photos.id,
        albumId: db.photos.albumId,
        url: db.photos.url,
        clients: db.photos.clients,
        paid: db.photos.paid
    }).from(db.photos).where(eq(db.photos.id, photoId));
    return info[0]
}

export async function addClientsToPhoto(photoId: number, newClients: string[]): Promise<void> {
    let info = await getPhotoInfo(photoId)
    let oldClients = info ? JSON.parse(info.clients): []
    let resultingClients = [...oldClients, ...newClients]
    await db.db.update(db.photos).set({clients: JSON.stringify(resultingClients)}).where(eq(db.photos.id, photoId));
}

export async function insertNewSelfie(clientId: number, url: string): Promise<void> {
    await db.db.insert(db.selfies).values({ clientId, url });
}

export async function labelPhotosAsPaid(photoIds: number[]): Promise<void> {
    await db.db.update(db.photos).set({paid: 1}).where(inArray(db.photos.id, photoIds));
}

