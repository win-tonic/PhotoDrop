import { Request, Response } from 'express';
import { changeName, getClientInfo, getClientAlbums, getClientPhotos, getClientSelfie } from '../db/dbInteractions/dbClient';

class ClientController {
    constructor() {
        this.changeName = this.changeName.bind(this);
        this.getInfo = this.getInfo.bind(this);
        this.getAlbums = this.getAlbums.bind(this);
        this.getPhotos = this.getPhotos.bind(this);
    }

    public async getInfo(req: Request, res: Response) {
        const phoneNumber = res.locals.tokenInfo.phoneNumber;
        const info = await getClientInfo(phoneNumber);
        const selfie = await getClientSelfie(phoneNumber);
        res.status(200).json({ status: 200, info, selfie });
    }

    public async changeName(req: Request, res: Response) {
        const phoneNumber = res.locals.tokenInfo.phoneNumber;
        const name = req.body.name as string;
        await changeName(phoneNumber, name);
        res.status(200).json({ status: 200, message: 'Name changed successfully' });
    }

    public async getAlbums(req: Request, res: Response) {
        const phoneNumber = res.locals.tokenInfo.phoneNumber;
        const albums = await getClientAlbums(phoneNumber);
        res.status(200).json({ status: 200, albums });
    }

    public async getPhotos(req: Request, res: Response) {
        const phoneNumber = res.locals.tokenInfo.phoneNumber;
        const albumId = parseInt(req.query.albumId as string, 10) || 0;
        const photos = await getClientPhotos(phoneNumber, albumId);
        res.status(200).json({ status: 200, photos });
    }

    public async getDashboard(req: Request, res: Response) {
        const phoneNumber = res.locals.tokenInfo.phoneNumber;
        const albums = await getClientAlbums(phoneNumber);
        let photos = await getClientPhotos(phoneNumber, 0);
        res.status(200).json({ status: 200, albums, photos });
    }
}

const clientController = new ClientController();
export { clientController };