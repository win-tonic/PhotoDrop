import { Request, Response } from 'express';
import { insertNewAlbum, getAlbum, photographerAlbums, albumPhotos, labelAlbumAsPaid } from '../db/dbInteractions/dbAlbum';

class AlbumController {
    public async createAlbum(req: Request, res: Response) {
        const name = req.body.name as string;
        const location = req.body.location as string;
        const datapicker = req.body.datapicker as string;
        const price = req.body.price as number;
        const photographerId = res.locals.tokenInfo.id;
        if (!name) {
            res.status(400).send('Name is required');
            return;
        }
        if (!location) {
            res.status(400).send('Location is required');
            return;
        }
        if (!datapicker) {
            res.status(400).send('Date is required');
            return;
        }
        if (!price) {
            res.status(400).send('Price is required');
            return;
        }
        await insertNewAlbum(name, location, datapicker, photographerId, price);
        res.status(200).send('Album created');
    }

    public async getInfo(req: Request, res: Response) {
        const id = parseInt(req.query.id as string, 10)
        const info = await getAlbum(id)
        res.json(info)
    }

    public async getAlbums(req: Request, res: Response) {
        const photographerId = res.locals.tokenInfo.id
        const albums = await photographerAlbums(photographerId)
        res.json(albums)
    }

    public async getPhotos(req: Request, res: Response) {
        const id = parseInt(req.query.id as string, 10)
        const photos = await albumPhotos(id)
        res.json(photos)
    }

    public async labelAsPaid(req: Request, res: Response) {
        const albumId = parseInt(req.query.albumId as string, 10)
        await labelAlbumAsPaid(albumId)
        res.status(200).send('Album labeled as paid')
    }
}

const albumController = new AlbumController();
export { albumController };
