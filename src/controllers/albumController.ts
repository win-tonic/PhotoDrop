import { Request, Response } from 'express';
import { verifyToken } from '../middleware/Auth'
import { insertNewAlbum } from '../db/dbInteractions/dbAlbum';

class AlbumController {
    public async createAlbum(req: Request, res: Response) {
        const name = req.query.name as string;
        const location = req.query.location as string;
        const datapicker = req.query.datapicker as string;
        const photographerInfo = verifyToken(req.headers.token as string)
        const photographerId = (photographerInfo != undefined && typeof photographerInfo != "string") ? photographerInfo.id : undefined
        if (!name || !location || !datapicker || !photographerId) {
            res.status(400).send('Missing required information');
            return;
        }
        await insertNewAlbum(name, location, datapicker, photographerId);
        res.status(200).send('Album created');
    }
}

const albumController = new AlbumController();
export { albumController };
