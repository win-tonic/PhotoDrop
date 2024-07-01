import jwt from 'jsonwebtoken';
import { getPhotographerInfo, addPhotographer, getHashedPassword } from '../db/dbInteractions/dbPhotographerAuth';
import { hashPassword, verifyPassword } from './hashService';
import { SECRET_KEY } from '../config/config';

class PhotographerAuthService {
    private async generatePhotographerLoginToken(login: string): Promise<string> {
        const userInfo = await getPhotographerInfo(login);
        return jwt.sign(userInfo, SECRET_KEY, { expiresIn: '1d' });
    }

    public async authenticatePhotographer(login: string, password: string): Promise<string | undefined> {
        const hash = await getHashedPassword(login);
        const match = hash ? await verifyPassword(password, hash) : false;
        if (!match) {
            return undefined;
        }
        return await this.generatePhotographerLoginToken(login);
    }

    public async registerPhotographer(login: string, password: string, fullname: string, email: string): Promise<void> {
        const hash = await hashPassword(password);
        await addPhotographer(login, hash, fullname, email);
    }
}

const photographerAuthService = new PhotographerAuthService();
export { photographerAuthService };
