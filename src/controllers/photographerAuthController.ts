import { Request, Response } from 'express';
import { photographerAuthService } from '../services/photographerAuthService';
import { CustomError } from '../middleware/errorHandler';

class PhotographerAuthController {
    constructor() {
        this.loginPhotographer = this.loginPhotographer.bind(this);
        this.registerPhotographer = this.registerPhotographer.bind(this);
    }

    public async loginPhotographer(req: Request, res: Response) {
        const login = req.body.login as string;
        const password = req.body.password as string;

        if (!login || !password) {
            throw new CustomError('Login and password are required', 400);
        }

        const token = await photographerAuthService.authenticatePhotographer(login, password);
        if (token) {
            res.status(200).json({ token });
        } else {
            throw new CustomError('Failed to log in', 401);
        }
    }

    public async registerPhotographer(req: Request, res: Response) {
        const login = req.body.login as string;
        const password = req.body.password as string;
        const fullname = req.body.fullname as string;
        const email = req.body.email as string;

        if (!login || !password || !fullname || !email) {
            throw new CustomError('All fields are required', 400);
        }

        await photographerAuthService.registerPhotographer(login, password, fullname, email);
        res.status(201).json({ message: 'Photographer registered successfully' });
    }
}

const photographerAuthController = new PhotographerAuthController();
export { photographerAuthController };
