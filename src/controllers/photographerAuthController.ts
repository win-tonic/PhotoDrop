//NE ZABUD POMIENYAT NA ENV VARS POTOM PZH
//i parol po heshu sravivat i hranit tolko hash, ne pozorsya (na retoole pohodu kak-to tozhe meniai hz)

import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { checkPhotographersCreds, getPhotographerInfo } from '../db/dbInteractions/dbPhotographerAuth';
import dotenv from "dotenv";
dotenv.config();

const SECRET_KEY_PHOTOGRAPHERS = process.env.PHOTOGRAPHERS_SECRET_KEY as string;

class PhtotographerAuthController {
    constructor() {
        this.loginPhotographer = this.loginPhotographer.bind(this);
        this.authenticatePhotographer = this.authenticatePhotographer.bind(this);
        this.generatePhotographerLoginToken = this.generatePhotographerLoginToken.bind(this);
    }

    private async generatePhotographerLoginToken(login: string): Promise<string> {
        const userInfo = await getPhotographerInfo(login);
        return jwt.sign(userInfo, SECRET_KEY_PHOTOGRAPHERS, { expiresIn: '1d' });
    }

    private async authenticatePhotographer(login: string, password: string): Promise<string | undefined> {
        const rightCreds = await checkPhotographersCreds(login, password);
        let token = rightCreds ? await this.generatePhotographerLoginToken(login) : undefined;
        return token;
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

const photographerAuthController = new PhtotographerAuthController();
export { photographerAuthController };

// // function test() {
// async function test() {
//     let a = await 
//     console.log(a)
// }

// test()