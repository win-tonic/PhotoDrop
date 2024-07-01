import { Request, Response, NextFunction } from 'express';
import { clientAuthService } from '../services/clientAuthService';
import { CustomError } from '../middleware/errorHandler';

class ClientAuthController {
    constructor() {
        this.sendOtp = this.sendOtp.bind(this);
        this.checkOtp = this.checkOtp.bind(this);
    }

    public async sendOtp(req: Request, res: Response, next: NextFunction) {
        const phoneNumber = req.body.phoneNumber as string;
        if (!phoneNumber) {
            throw new CustomError('Phone number is required', 400);
        }
        const message = await clientAuthService.sendOtp(phoneNumber);
        res.status(200).json({ message });
    }

    public async checkOtp(req: Request, res: Response, next: NextFunction) {
        const phoneNumber = req.query.phoneNumber as string;
        const otp = req.query.otp as string;
        const token = await clientAuthService.checkOtp(phoneNumber, otp);
        res.status(200).json({ token });
    }
}

const clientAuthController = new ClientAuthController();
export { clientAuthController };
