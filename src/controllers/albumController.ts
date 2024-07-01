import { Request, Response } from 'express';
import { albumService } from '../services/albumService';
import { CustomError } from '../middleware/errorHandler';

class AlbumController {
    public async createAlbum(req: Request, res: Response) {
        const { name, location, datapicker, price } = req.body;
        const photographerId = res.locals.tokenInfo.id;

        if (!name) throw new CustomError('Name is required', 400);
        if (!location) throw new CustomError('Location is required', 400);
        if (!datapicker) throw new CustomError('Date is required', 400);
        if (!price) throw new CustomError('Price is required', 400);

        await albumService.createAlbum({ name, location, datapicker, price, photographerId });
        res.status(200).send('Album created');
    }

    public async getInfo(req: Request, res: Response) {
        const id = parseInt(req.query.id as string, 10);
        if (isNaN(id)) throw new CustomError('Invalid album ID', 400);

        const info = await albumService.getInfo(id);
        res.json(info);
    }

    public async getAlbums(req: Request, res: Response) {
        const photographerId = res.locals.tokenInfo.id;
        const albums = await albumService.getAlbums(photographerId);
        res.json(albums);
    }

    public async getPhotos(req: Request, res: Response) {
        const id = parseInt(req.query.id as string, 10);
        if (isNaN(id)) throw new CustomError('Invalid album ID', 400);

        const photos = await albumService.getPhotos(id);
        res.json(photos);
    }

    public async labelAsPaid(req: Request, res: Response) {
        const albumId = parseInt(req.query.albumId as string, 10);
        if (isNaN(albumId)) throw new CustomError('Invalid album ID', 400);

        await albumService.labelAsPaid(albumId);
        res.status(200).send('Album labeled as paid');
    }
}

const albumController = new AlbumController();
export { albumController };
