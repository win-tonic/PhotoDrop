import { unwatermarkPhotos } from '../../utilities/utilities';
import { db, ClientType, AlbumType, PhotoType, SelfieType} from '../db';
import { eq, and, like } from 'drizzle-orm';

export async function getClientInfo(phoneNumber: string): Promise<ClientType[]> {
    return await db.db.select({
        id: db.clients.id,
        phoneNumber: db.clients.phoneNumber,
        name: db.clients.name
    }).from(db.clients).where(eq(db.clients.phoneNumber, phoneNumber));
}

export async function changeName(phoneNumber: string, name: string): Promise<void> {
    await db.db.update(db.clients).set({ name }).where(eq(db.clients.phoneNumber, phoneNumber));
}

export async function getClientAlbums(phoneNumber: string): Promise<AlbumType[]> {
    return await db.db.select({
        id: db.albums.id,
        photographerId: db.albums.photographerId,
        name: db.albums.name,
        location: db.albums.location,
        datapicker: db.albums.datapicker,
        paid: db.albums.paid
    }).from(db.albums).where(like(db.albums.datapicker, `%${phoneNumber}%`));
}

export async function getClientPhotos(phoneNumber: string, albumId: number): Promise<PhotoType[]> {
    let result: PhotoType[];
    if (!albumId) {
        result = await db.db.select({
            id: db.photos.id,
            albumId: db.photos.albumId,
            url: db.photos.url,
            clients: db.photos.clients,
            paid: db.photos.paid
        }).from(db.photos).where(like(db.photos.clients, `%${phoneNumber}%`));
    } else {
        result = await db.db.select({
            id: db.photos.id,
            albumId: db.photos.albumId,
            url: db.photos.url,
            clients: db.photos.clients,
            paid: db.photos.paid
        }).from(db.photos).where(and(eq(db.photos.albumId, albumId), like(db.photos.clients, `%${phoneNumber}%`)));
    }
    return unwatermarkPhotos(result, 'paidOnly');
}

export async function getClientSelfies(phoneNumber: string): Promise<SelfieType[]> {
    return await db.db.select({
        id: db.selfies.id,
        phoneNumber: db.selfies.phoneNumber,
        url: db.selfies.url,
        isDeleted: db.selfies.isDeleted
    }).from(db.selfies).where(and(eq(db.selfies.phoneNumber, phoneNumber), eq(db.selfies.isDeleted, 0)));
}

