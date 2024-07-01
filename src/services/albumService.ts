import { insertNewAlbum, getAlbum, photographerAlbums, albumPhotos, labelAlbumAsPaid } from '../db/dbInteractions/dbAlbum';
import { CustomError } from '../middleware/errorHandler';

class AlbumService {
    public async createAlbum(albumData: { name: string, location: string, datapicker: string, price: number, photographerId: number }) {
        const { name, location, datapicker, price, photographerId } = albumData;
        await insertNewAlbum(name, location, datapicker, photographerId, price);
    }

    public async getInfo(id: number) {
        const info = await getAlbum(id);
        if (!info) throw new CustomError('Album not found', 404);
        return info;
    }

    public async getAlbums(photographerId: number) {
        return await photographerAlbums(photographerId);
    }

    public async getPhotos(id: number) {
        return await albumPhotos(id);
    }

    public async labelAsPaid(albumId: number) {
        await labelAlbumAsPaid(albumId);
    }
}

const albumService = new AlbumService();
export { albumService };
