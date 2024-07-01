import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { photoService } from '../services/photoService';
import { CustomError } from '../middleware/errorHandler';

const upload = multer();

class PhotoController {
    constructor() {
        this.uploadPhotographerPhotos = this.uploadPhotographerPhotos.bind(this);
        this.uploadSelfies = this.uploadSelfies.bind(this);
        this.labelPhotosAsPaid = this.labelPhotosAsPaid.bind(this);
        this.addClients = this.addClients.bind(this);
    }

    public async uploadPhotographerPhotos(req: Request, res: Response) {
        const albumId = parseInt(req.body.albumId as string, 10);
        const clients = req.body.clients as string || '[]';
        const price = parseFloat(req.body.price as string);

        if (!albumId || !price) {
            throw new CustomError('Invalid albumId or price', 400);
        }

        const files = req.files as Express.Multer.File[];
        if (!files || files.length === 0) {
            throw new CustomError('No files uploaded', 400);
        }

        await photoService.uploadPhotographerPhotos(albumId, clients, price, files);
        res.status(200).json({ status: 200, message: 'Files uploaded successfully' });
    }

    public async addClients(req: Request, res: Response) {
        const photoId = req.body.photoId;
        const newClients = req.body.clientsArray;
        await photoService.addClients(photoId, newClients);
        res.status(200).json({ status: 200, message: 'Clients added successfully' });
    }

    public async uploadSelfies(req: Request, res: Response) {
        const files = req.files as Express.Multer.File[];
        const clientPhoneNumber = res.locals.tokenInfo.phoneNumber;
        if (!files || files.length === 0) {
            throw new CustomError('No files uploaded', 400);
        }

        await photoService.uploadSelfies(clientPhoneNumber, files);
        res.status(200).json({ status: 200, message: 'Files uploaded successfully' });
    }

    public async labelPhotosAsPaid(req: Request, res: Response) {
        const photoIds = JSON.parse(req.query.photoIds as string);
        await photoService.labelPhotosAsPaid(photoIds);
        res.status(200).json({ status: 200, message: 'Photos labeled as paid' });
    }
}

const photoController = new PhotoController();
export { photoController, upload };
