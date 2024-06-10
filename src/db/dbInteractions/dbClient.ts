import { unwatermarkPhotos } from '../../utilities/utilities';
import { db, ClientType, AlbumType, PhotoType, SelfieType } from '../db';
import { eq, and, like, inArray, max } from 'drizzle-orm';

export async function getClientInfo(phoneNumber: string): Promise<ClientType[]> {
    return await db.db.select({
        id: db.clients.id,
        phoneNumber: db.clients.phoneNumber,
        name: db.clients.name
    }).from(db.clients).where(eq(db.clients.phoneNumber, phoneNumber));
}

export async function getClientSelfie(phoneNumber: string): Promise<Omit<SelfieType, 'isDeleted'>> {
    const result = await db.db.select({
        id: db.selfies.id,
        phoneNumber: db.selfies.phoneNumber,
        url: db.selfies.url
    }).from(db.selfies).where(and(eq(db.selfies.phoneNumber, phoneNumber), eq(db.selfies.isDeleted, 0)))
    return result[0];
}

export async function changeName(phoneNumber: string, name: string): Promise<void> {
    await db.db.update(db.clients).set({ name }).where(eq(db.clients.phoneNumber, phoneNumber));
}

export async function getClientAlbumsInfo(phoneNumber: string): Promise<AlbumType[]> {
    return await db.db.select({
        id: db.albums.id,
        photographerId: db.albums.photographerId,
        name: db.albums.name,
        location: db.albums.location,
        datapicker: db.albums.datapicker,
        paid: db.albums.paid
    }).from(db.albums).where(like(db.albums.datapicker, `%${phoneNumber}%`));
}

export async function getClientAlbums(phoneNumber: string): Promise<(AlbumType & { topPhoto?: PhotoType })[]> {
    const info = await getClientAlbumsInfo(phoneNumber);
    const albumIds = info.map(album => album.id);
    const topPhotoIds = db.db.$with('topPhotoIds').as(db.db.select({
        maxId: max(db.photos.id).as('maxId')
    }).from(db.photos).where(inArray(db.photos.albumId, albumIds)).groupBy(db.photos.albumId));
    const topPhotos = await db.db.with(topPhotoIds).select({
        id: db.photos.id,
        albumId: db.photos.albumId,
        url: db.photos.url,
        clients: db.photos.clients,
        paid: db.photos.paid
    }).from(db.photos).innerJoin(topPhotoIds, eq(db.photos.id, topPhotoIds.maxId));
    // const topPhotos = await db.db.selectDistinctOn([db.photos.albumId], {
    //     id: db.photos.id,
    //     albumId: db.photos.albumId,
    //     url: db.photos.url,
    //     clients: db.photos.clients,
    //     paid: db.photos.paid
    // }).from(db.photos).where(inArray(db.photos.albumId, albumIds)).orderBy(db.photos.albumId, db.photos.id);
    const unwatermarked = unwatermarkPhotos(topPhotos, 'paidOnly');
    return info.map(album => ({
        ...album,
        topPhoto: unwatermarked.find(photo => photo.albumId === album.id)
    })) as (AlbumType & { topPhoto?: PhotoType })[];
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


