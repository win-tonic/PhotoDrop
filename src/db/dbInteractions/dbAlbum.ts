import { db } from "../db";
import {eq} from 'drizzle-orm'

export async function insertNewAlbum(name: string, location: string, datapicker: string, photographerId: number): Promise<void> {
    await db.db.insert(db.albums).values({ name: name, location: location, datapicker: datapicker, photographerId: photographerId })
}

//TYPIFY!!!
export async function albumInfo(id: number): Promise<any> {
    await db.db.select().from(db.albums).where(eq(db.albums.id, id)).execute();
}
//TYPIFY!!!
export async function albumPhotos(id: number): Promise<any> {
    await db.db.select().from(db.photos).where(eq(db.photos.albumId, id)).execute();
}