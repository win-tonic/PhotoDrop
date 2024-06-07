import { Request, Response } from 'express';
import { uploadFile } from '../services/s3service';
import { insertNewPhoto } from '../db/dbInteractions/dbPhoto';
import multer from 'multer';

const upload = multer();

class PhotoController {
    constructor() {
        this.uploadPhotos = this.uploadPhotos.bind(this);
    }

    public async uploadPhotos(req: Request, res: Response) {
        const albumId = parseInt(req.body.albumId as string, 10);

        if (isNaN(albumId)) {
            return res.status(400).json({ status: 400, message: 'Invalid albumId' });
        }

        const files = req.files as Express.Multer.File[];

        if (!files || files.length === 0) {
            return res.status(400).json({ status: 400, message: 'No files uploaded' });
        }

        try {
            for (const file of files) {
                const result = await uploadFile(file);
                await insertNewPhoto(albumId, result.Location, '');
            }
            res.status(200).json({ status: 200, message: 'Files uploaded successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: 500, message: 'An error occurred while uploading files' });
        }
    }
}

const photoController = new PhotoController();
export { photoController, upload };
