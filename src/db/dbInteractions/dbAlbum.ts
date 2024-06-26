import { db, AlbumType, PhotoType } from "../db";
import { eq, inArray, max } from 'drizzle-orm';
import { unwatermarkPhotos } from "../../utilities/utilities";
import { getPhotosInfo } from './dbPhoto';
import { generatePresignedUrl } from "../../services/s3service";


export async function insertNewAlbum(name: string, location: string, datapicker: string, photographerId: number, price: number): Promise<void> {
    await db.db.insert(db.albums).values({ name, location, datapicker, photographerId, price })
}


export async function albumInfo(id: number): Promise<AlbumType[]> {
    const result = await db.db.select({
        id: db.albums.id,
        photographerId: db.albums.photographerId,
        name: db.albums.name,
        location: db.albums.location,
        datapicker: db.albums.datapicker,
        price: db.albums.price,
        paid: db.albums.paid
    }).from(db.albums).where(eq(db.albums.id, id));
    return result;
}

export async function photographerAlbumsInfo(photographerId: number): Promise<AlbumType[]> {
    const result = await db.db.select({
        id: db.albums.id,
        photographerId: db.albums.photographerId,
        name: db.albums.name,
        location: db.albums.location,
        datapicker: db.albums.datapicker,
        price: db.albums.price,
        paid: db.albums.paid
    }).from(db.albums).where(eq(db.albums.photographerId, photographerId));
    return result;
}

export async function photographerAlbums(photographerId: number): Promise<(AlbumType & { topPhoto?: PhotoType })[]> {
    const info = await photographerAlbumsInfo(photographerId);
    const albumIds = info.map(album => album.id);
    const topPhotoIds = db.db.$with('topPhotoIds').as(db.db.select({
        maxId: max(db.photos.id).as('maxId')
    }).from(db.photos).where(inArray(db.photos.albumId, albumIds)).groupBy(db.photos.albumId))
    const topPhotos = await db.db.with(topPhotoIds).select({
        id: db.photos.id,
        albumId: db.photos.albumId,
        url: db.photos.url,
        clients: db.photos.clients,
        price: db.albums.price,
        paid: db.photos.paid
    }).from(db.photos).innerJoin(topPhotoIds, eq(db.photos.id, topPhotoIds.maxId));
    const unwatermarked = unwatermarkPhotos(topPhotos, 'force');
    return info.map(album => ({
        ...album,
        topPhoto: unwatermarked.find(photo => photo.albumId === album.id)
    })) as (AlbumType & { topPhoto?: PhotoType })[];
}


export async function albumPhotos(albumId: number): Promise<PhotoType[]> {
    const result = await db.db.select({
        id: db.photos.id,
        albumId: db.photos.albumId,
        url: db.photos.url,
        clients: db.photos.clients,
        price: db.albums.price,
        paid: db.photos.paid
    }).from(db.photos).where(eq(db.photos.albumId, albumId));
    const unwatermarked = unwatermarkPhotos(result, 'force');
    return unwatermarked.map(photo => { return { ...photo, url: generatePresignedUrl(photo.url) } });
}

export async function getAlbum(albumId: number): Promise<AlbumType & { photos: PhotoType[] }> {
    const info = await albumInfo(albumId);
    const photos = await albumPhotos(albumId);
    return { ...info[0], photos }
}

export async function labelAlbumAsPaid(albumId: number): Promise<void> {
    await db.db.update(db.albums).set({ paid: 1 }).where(eq(db.albums.id, albumId));
    await db.db.update(db.photos).set({ paid: 1 }).where(eq(db.photos.albumId, albumId));
}

export async function getAlbumPrice(albumId: number): Promise<number> {
    const info = await db.db.select({
        price: db.albums.price
    }).from(db.albums).where(eq(db.albums.id, albumId));
    return info[0].price;
}
