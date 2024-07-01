import { changeEmail, changeName, getClientInfo, getClientAlbums, getClientPhotos, getClientSelfie } from '../db/dbInteractions/dbClient';
import { CustomError } from '../middleware/errorHandler';

class ClientService {
    public async getInfo(phoneNumber: string) {
        const info = await getClientInfo(phoneNumber);
        if (!info) throw new CustomError('Client info not found', 404);
        const selfie = await getClientSelfie(phoneNumber);
        return { info, selfie };
    }

    public async changeName(phoneNumber: string, name: string) {
        await changeName(phoneNumber, name);
    }

    public async changeEmail(phoneNumber: string, email: string) {
        await changeEmail(phoneNumber, email);
    }

    public async getAlbums(phoneNumber: string) {
        return await getClientAlbums(phoneNumber);
    }

    public async getPhotos(phoneNumber: string, albumId: number) {
        return await getClientPhotos(phoneNumber, albumId);
    }

    public async getDashboard(phoneNumber: string) {
        const albums = await getClientAlbums(phoneNumber);
        const photos = await getClientPhotos(phoneNumber, 0);
        return { albums, photos };
    }
}

const clientService = new ClientService();
export { clientService };
