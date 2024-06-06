//NE ZABUD POMIENYAT NA ENV VARS POTOM PZH
//i parol po heshu sravivat i hranit tolko hash, ne pozorsya (na retoole pohodu kak-to tozhe meniai hz)

import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { checkPhotographersCreds, getPhotogrpherInfo } from '../db/dbInteractions/dbAuth';

const SECRET_KEY_PHOTOGRAPHERS = 'secretkeyforphotographerslol';

class AuthController {
    private generatePhotographerLoginToken(login: string): string {
        let userInfo = getPhotogrpherInfo(login)
        return jwt.sign(userInfo, SECRET_KEY_PHOTOGRAPHERS, { expiresIn: '1d' });
    }

    private async authenticatePhotographer(login: string, password: string): Promise<string | undefined> {
        const rightCreds = await checkPhotographersCreds(login, password)
        return rightCreds ? this.generatePhotographerLoginToken(login) : undefined
    }

    public async loginPhotographer(req: Request, res: Response) {
        const login = req.query.login as string;
        const password = req.query.password as string;
        const token = await this.authenticatePhotographer(login, password);
        if (token) {
            res.status(200).json({ token });
        } else {
            res.status(401).json({ status: 401, message: 'Failed to log in' });
        }
    }
}

const authController = new AuthController();
export { authController };