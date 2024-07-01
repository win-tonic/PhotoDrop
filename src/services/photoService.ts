import { uploadFile } from './s3service';
import { insertNewPhoto, addClientsToPhoto, insertNewSelfie, labelPhotosAsPaid } from '../db/dbInteractions/dbPhoto';
import path from 'path';
import { addImageWatermark } from 'sharp-watermark';

class PhotoService {
    private async _watermarkPhoto(photoBuffer: Buffer): Promise<Buffer> {
        const watermarkPath = path.resolve(__dirname, '../../assets/watermark.png');
        const watermarkedImage = await addImageWatermark(photoBuffer, watermarkPath);
        return await watermarkedImage.toBuffer();
    }

    public async uploadPhotographerPhotos(albumId: number, clients: string, price: number, files: Express.Multer.File[]) {
        for (const file of files) {
            const watermarkedPhoto = await this._watermarkPhoto(file.buffer);
            const watermarkedResult = await uploadFile(watermarkedPhoto, file.mimetype, 'photos/watermarked', file.originalname);
            const originalResult = await uploadFile(file.buffer, file.mimetype, 'photos/original', file.originalname);
            await insertNewPhoto(albumId, watermarkedResult.key, clients, price);
        }
    }

    public async addClients(photoId: number, newClients: string[]) {
        await addClientsToPhoto(photoId, newClients);
    }

    public async uploadSelfies(clientPhoneNumber: string, files: Express.Multer.File[]) {
        for (const file of files) {
            const result = await uploadFile(file.buffer, file.mimetype, 'selfies', file.originalname);
            await insertNewSelfie(clientPhoneNumber, result.key);
        }
    }

    public async labelPhotosAsPaid(photoIds: number[]) {
        await labelPhotosAsPaid(photoIds);
    }
}

const photoService = new PhotoService();
export { photoService };
