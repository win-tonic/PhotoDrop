import { Request, Response } from 'express';
import { clientService } from '../services/clientService';
import { CustomError } from '../middleware/errorHandler';

class ClientController {
    constructor() {
        this.changeName = this.changeName.bind(this);
        this.getInfo = this.getInfo.bind(this);
        this.getAlbums = this.getAlbums.bind(this);
        this.getPhotos = this.getPhotos.bind(this);
        this.getDashboard = this.getDashboard.bind(this);
        this.changeEmail = this.changeEmail.bind(this);
    }

    public async getInfo(req: Request, res: Response) {
        const phoneNumber = res.locals.tokenInfo.phoneNumber;
        const { info, selfie } = await clientService.getInfo(phoneNumber);
        res.status(200).json({ status: 200, info, selfie });
    }

    public async changeName(req: Request, res: Response) {
        const phoneNumber = res.locals.tokenInfo.phoneNumber;
        const name = req.body.name as string;
        if (!name) throw new CustomError('Name is required', 400);
        await clientService.changeName(phoneNumber, name);
        res.status(200).json({ status: 200, message: 'Name changed successfully' });
    }

    public async changeEmail(req: Request, res: Response) {
        const phoneNumber = res.locals.tokenInfo.phoneNumber;
        const email = req.body.email as string;
        if (!email) throw new CustomError('Email is required', 400);
        await clientService.changeEmail(phoneNumber, email);
        res.status(200).json({ status: 200, message: 'Email changed successfully' });
    }

    public async getAlbums(req: Request, res: Response) {
        const phoneNumber = res.locals.tokenInfo.phoneNumber;
        const albums = await clientService.getAlbums(phoneNumber);
        res.status(200).json({ status: 200, albums });
    }

    public async getPhotos(req: Request, res: Response) {
        const phoneNumber = res.locals.tokenInfo.phoneNumber;
        const albumId = parseInt(req.query.albumId as string, 10) || 0;
        const photos = await clientService.getPhotos(phoneNumber, albumId);
        res.status(200).json({ status: 200, photos });
    }

    public async getDashboard(req: Request, res: Response) {
        const phoneNumber = res.locals.tokenInfo.phoneNumber;
        const { albums, photos } = await clientService.getDashboard(phoneNumber);
        res.status(200).json({ status: 200, albums, photos });
    }
}

const clientController = new ClientController();
export { clientController };
