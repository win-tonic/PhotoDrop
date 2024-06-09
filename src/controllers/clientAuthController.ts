import { Request, Response } from 'express';
import { addOtpRecord, getOtpRecord, clearOtpRecord, addTryN, checkIfClientExists, addClient, getClientInfo } from '../db/dbInteractions/dbClientAuth';
import { sendOtpToTelegram } from '../services/telegramBot';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();

const SECRET_KEY_CLIENTS = process.env.CLIENTS_SECRET_KEY as string;

class ClientAuthController {
    constructor() {
        this.generateOTP = this.generateOTP.bind(this);
        this.sendOtp = this.sendOtp.bind(this);
        this.checkOtp = this.checkOtp.bind(this);
        this.generateClientLoginToken = this.generateClientLoginToken.bind(this);
    }

    private async generateClientLoginToken(phone: string): Promise<string> {
        const userInfo = await getClientInfo(phone);
        return jwt.sign(userInfo, SECRET_KEY_CLIENTS, { expiresIn: '1d' });
    }

    private generateOTP(): string {
        var chars = "0123456789";
        var string_length = 6;
        var randomstring = '';
        for (var i = 0; i < string_length; i++) {
            var rnum = Math.floor(Math.random() * chars.length);
            randomstring += chars[rnum];
        }
        return randomstring;
    }

    public async sendOtp(req: Request, res: Response) {
        const phoneNumber = req.body.phoneNumber as string;
        const otpRecord = await getOtpRecord(phoneNumber);
        if (!otpRecord[0]) {
            const otp = this.generateOTP();
            const exists = await checkIfClientExists(phoneNumber);
            if (!exists) {
                await addClient(phoneNumber, '');
            }
            await addOtpRecord(phoneNumber, otp, 1);
            await sendOtpToTelegram(otp);
            res.status(200).json({ status: 200, message: 'OTP sent successfully' });
        } else if (otpRecord[0].tryN > 2) {
            res.status(401).json({ status: 401, message: 'Too many attempts' });
        } else {
            const otp = this.generateOTP();
            await addTryN(otp, phoneNumber, otpRecord[0].tryN);
            await sendOtpToTelegram(otp);
            res.status(200).json({ status: 200, message: 'OTP sent successfully' });
        }
    }

    public async checkOtp(req: Request, res: Response) {
        const phoneNumber = req.query.phoneNumber as string;
        const otp = req.query.otp as string;
        const otpRecord = await getOtpRecord(phoneNumber);
        if (!otpRecord[0]) {
            res.status(404).json({ status: 404, message: 'OTP not found' });
        } else if (otpRecord[0].otp != otp) {
            res.status(401).json({ status: 401, message: 'Invalid OTP' });
        } else if (otpRecord[0].tryN > 2) {
            res.status(401).json({ status: 401, message: 'Too many attempts' });
        } else if (new Date().getTime() - otpRecord[0].timeSent.getTime() > 600000) {
            res.status(401).json({ status: 401, message: 'OTP expired' });
        } else {
            await clearOtpRecord(phoneNumber);
            const token = await this.generateClientLoginToken(phoneNumber);
            res.status(200).json({token});
        }
    }
}

const clientAuthController = new ClientAuthController();
export { clientAuthController };