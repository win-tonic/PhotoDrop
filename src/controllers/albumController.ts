import { Request, Response } from 'express';
import { insertNewAlbum, getAlbum, photographerAlbums, albumPhotos, labelAlbumAsPaid } from '../db/dbInteractions/dbAlbum';

class AlbumController {
    public async createAlbum(req: Request, res: Response) {
        const name = req.query.name as string;
        const location = req.query.location as string;
        const datapicker = req.query.datapicker as string;
        const photographerId = res.locals.tokenInfo.id;
        if (!name || !location || !datapicker || !photographerId) {
            res.status(400).send('Missing required information');
            return;
        }
        await insertNewAlbum(name, location, datapicker, photographerId);
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
