import { db } from "../db";

export async function insertNewAlbum(name: string, location: string, datapicker: string, photographerId: number): Promise<void> {
    await db.db.insert(db.albums).values({ name: name, location: location, datapicker: datapicker, photographerId: photographerId })
}