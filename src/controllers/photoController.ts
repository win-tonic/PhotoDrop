import { Request, Response } from 'express';
import { uploadFile } from '../services/s3service';
import { insertNewPhoto, addClientsToPhoto, insertNewSelfie, labelPhotosAsPaid } from '../db/dbInteractions/dbPhoto';
import multer from 'multer';

const upload = multer();

class PhotoController {
    constructor() {
        this.uploadPhotographerPhotos = this.uploadPhotographerPhotos.bind(this);
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
                const result = await uploadFile(file, 'photos');
                await insertNewPhoto(albumId, result.Location, clients);
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
        const clientId = parseInt(req.body.clientId as string, 10)
        if (!files || files.length === 0) {
            return res.status(400).json({ status: 400, message: 'No files uploaded' });
        }
        try {
            for (const file of files) {
                const result = await uploadFile(file, 'selfies');
                await insertNewSelfie(clientId, result.Location);
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
