import { db, PhotoType } from "../db";
import { eq, inArray } from 'drizzle-orm';
import { generatePresignedUrl } from "../../services/s3service";

export async function insertNewPhoto(albumId: number, url: string, clients: string, price: number): Promise<void> {
    await db.db.insert(db.photos).values({ albumId, url, clients, price });
}

export async function getPhotosInfo(photoIds: number[]): Promise<PhotoType[]> {
    const info = await db.db.select({
        id: db.photos.id,
        albumId: db.photos.albumId,
        url: db.photos.url,
        clients: db.photos.clients,
        price: db.albums.price,
        paid: db.photos.paid
    }).from(db.photos).where(inArray(db.photos.id, photoIds));
    return info.map(photo => { return { ...photo, url: generatePresignedUrl(photo.url) } })
}

export async function addClientsToPhoto(photoId: number, newClients: string[]): Promise<void> {
    let info = await getPhotosInfo([photoId])
    let oldClients = info ? JSON.parse(info[0].clients) : []
    let resultingClients = [...oldClients, ...newClients]
    await db.db.update(db.photos).set({ clients: JSON.stringify(resultingClients) }).where(eq(db.photos.id, photoId));
}

export async function insertNewSelfie(phoneNumber: string, url: string): Promise<void> {
    await db.db.update(db.selfies).set({ isDeleted: 1 }).where(eq(db.selfies.phoneNumber, phoneNumber));
    await db.db.insert(db.selfies).values({ phoneNumber, url });
}

export async function labelPhotosAsPaid(photoIds: number[]): Promise<void> {
    await db.db.update(db.photos).set({ paid: 1 }).where(inArray(db.photos.id, photoIds));
}

