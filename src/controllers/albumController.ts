import { Request, Response } from 'express';
import { db } from '../db/db';
import {verifyToken} from '../middleware/Auth'
const SECRET_KEY = 'secretkeyforphotographerslol';

//здесь наверное не безопасно, по сути каждый юзер может создавать каждому юзеру альбом
class AlbumController {
    public async createAlbum(req: Request, res: Response) {
        const name = req.query.name as string;
        const location = req.query.location as string;
        const datapicker = req.query.datapicker as string;
        const photographerInfo = verifyToken(req.header.token as string)
        const photographerId = (photographerInfo===)photographerInfo.photographerId
        try {
            await db.db.insert(db.albums).values({ name: name, location: location, datapicker: datapicker, photographerId: photographerId })
            res.
        }
    }
}

const albumController = new AlbumController();
export { albumController };
