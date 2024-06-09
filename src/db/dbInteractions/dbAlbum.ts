import { db, AlbumType, PhotoType} from "../db";
import { eq } from 'drizzle-orm';


export async function insertNewAlbum(name: string, location: string, datapicker: string, photographerId: number): Promise<void> {
    await db.db.insert(db.albums).values({ name: name, location: location, datapicker: datapicker, photographerId: photographerId })
}


export async function albumInfo(id: number): Promise<AlbumType[]> {
    const result = await db.db.select({
        id: db.albums.id,
        photographerId: db.albums.photographerId,
        name: db.albums.name,
        location: db.albums.location,
        datapicker: db.albums.datapicker,
        paid: db.albums.paid
    }).from(db.albums).where(eq(db.albums.id, id));
    return result;
}

export async function photographerAlbums(photographerId: number): Promise<AlbumType[]> {
    const result = await db.db.select({
        id: db.albums.id,
        photographerId: db.albums.photographerId,
        name: db.albums.name,
        location: db.albums.location,
        datapicker: db.albums.datapicker,
        paid: db.albums.paid
    }).from(db.albums).where(eq(db.albums.photographerId, photographerId));
    return result;
}

export async function albumPhotos(albumId: number): Promise<PhotoType[]> {
    const result = await db.db.select({
        id: db.photos.id,
        albumId: db.photos.albumId,
        url: db.photos.url,
        clients: db.photos.clients,
        paid: db.photos.paid
    }).from(db.photos).where(eq(db.photos.albumId, albumId));
    return result;
}

export async function labelAlbumAsPaid(albumId: number): Promise<void> {
    await db.db.update(db.albums).set({ paid: 1 }).where(eq(db.albums.id, albumId));
    await db.db.update(db.photos).set({ paid: 1 }).where(eq(db.photos.albumId, albumId));
}
