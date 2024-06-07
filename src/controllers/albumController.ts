import { Request, Response } from 'express';
import { insertNewAlbum, albumInfo, albumPhotos } from '../db/dbInteractions/dbAlbum';

class AlbumController {
    public async createAlbum(req: Request, res: Response) {
        const name = req.query.name as string;
        const location = req.query.location as string;
        const datapicker = req.query.datapicker as string;
        const photographerId = res.locals.tokenInfo.id
        if (!name || !location || !datapicker || !photographerId) {
            res.status(400).send('Missing required information');
            return;
        }
        await insertNewAlbum(name, location, datapicker, photographerId);
        res.status(200).send('Album created');
    }

    public async getInfo(req: Request, res: Response) {
        const id = parseInt(req.query.id as string, 10)
        const info = await albumInfo(id)
        res.json(info)
    }

    public async getPhotos(req: Request, res: Response) {
        const id = parseInt(req.query.id as string, 10)
        const info = await albumPhotos(id)
        res.json(info)
    }
}

const albumController = new AlbumController();
export { albumController };
