import { Request, Response } from 'express';
import { uploadFile } from '../services/s3service';
import { insertNewPhoto, addClientsToPhoto, insertNewSelfie, labelPhotosAsPaid } from '../db/dbInteractions/dbPhoto';
import multer from 'multer';
import { addImageWatermark } from "sharp-watermark"
import path from 'path';

const upload = multer();

class PhotoController {
    constructor() {
        this.uploadPhotographerPhotos = this.uploadPhotographerPhotos.bind(this);
        this.uploadSelfies = this.uploadSelfies.bind(this);
        this.labelPhotosAsPaid = this.labelPhotosAsPaid.bind(this);
        this.addClients = this.addClients.bind(this);
        this._watermarkPhoto = this._watermarkPhoto.bind(this);
    }

    private async _watermarkPhoto(photoBuffer: Buffer): Promise<Buffer> {
        const watermarkPath = path.resolve(__dirname, '../../assets/watermark.png');
        const watermarkedImage = await addImageWatermark(
            photoBuffer,
            watermarkPath
          );
        return await watermarkedImage.toBuffer();
        
    }

    public async uploadPhotographerPhotos(req: Request, res: Response) {
        const albumId = parseInt(req.body.albumId as string, 10);
        const clients = req.body.clients as string || '[]';

        if (isNaN(albumId)) {
            return res.status(400).json({ status: 400, message: 'Invalid albumId' });
        }

        const files = req.files as Express.Multer.File[];

        if (!files || files.length === 0) {
            return res.status(400).json({ status: 400, message: 'No files uploaded' });
        }

        try {
            for (const file of files) {
                const watermarkedPhoto = await this._watermarkPhoto(file.buffer);
                const watermarkedResult = await uploadFile(watermarkedPhoto, file.mimetype, 'photos/watermarked', file.originalname);
                const originalResult = await uploadFile(file.buffer, file.mimetype, 'photos/original', file.originalname);
                await insertNewPhoto(albumId, watermarkedResult.Location, clients);
            }
            res.status(200).json({ status: 200, message: 'Files uploaded successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: 500, message: 'An error occurred while uploading files' });
        }
    }

    public async addClients(req: Request, res: Response){
        const photoId = req.body.photoId;
        const newClients = req.body.clientsArray;
        await addClientsToPhoto(photoId, newClients)
        res.status(200).json({ status: 200, message: 'Clients added successfully' })
    }

    public async uploadSelfies(req: Request, res: Response) {
        const files = req.files as Express.Multer.File[];
        const clientPhoneNumber = res.locals.tokenInfo.phoneNumber;
        if (!files || files.length === 0) {
            return res.status(400).json({ status: 400, message: 'No files uploaded' });
        }
        try {
            for (const file of files) {
                const result = await uploadFile(file.buffer, file.mimetype, 'selfies', file.originalname);
                await insertNewSelfie(clientPhoneNumber, result.Location);
            }
            res.status(200).json({ status: 200, message: 'Files uploaded successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: 500, message: 'An error occurred while uploading files' });
        }
    }

    public async labelPhotosAsPaid(req: Request, res: Response) {
        const photoIds = JSON.parse(req.query.photoIds as string)
        await labelPhotosAsPaid(photoIds)
        res.status(200).json({ status: 200, message: 'Photos labeled as paid' })
    }

}

const photoController = new PhotoController();
export { photoController, upload };