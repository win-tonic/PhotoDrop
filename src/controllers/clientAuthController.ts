import { Request, Response } from 'express';
import { addOtpRecord, getOtpRecord, clearOtpRecord, addTryN, checkIfClientExists, addClient, getClientInfo } from '../db/dbInteractions/dbClientAuth';
import { sendOtpToTelegram } from '../services/telegramBot';
import { generateOTP } from '../utilities/utilities';
import {CLIENT_SECRET_KEY} from '../config/config';
import jwt from 'jsonwebtoken';

class ClientAuthController {
    constructor() {
        this.sendOtp = this.sendOtp.bind(this);
        this.checkOtp = this.checkOtp.bind(this);
        this.generateClientLoginToken = this.generateClientLoginToken.bind(this);
    }

    private async generateClientLoginToken(phone: string): Promise<string> {
        const userInfo = await getClientInfo(phone);
        return jwt.sign(userInfo, CLIENT_SECRET_KEY, { expiresIn: '1d' });
    }

    public async sendOtp(req: Request, res: Response) {
        const phoneNumber = req.body.phoneNumber as string;
        if (!phoneNumber) {
            res.status(400).json({ message: 'Phone number is required' });
            return;
        }
        const otpRecord = await getOtpRecord(phoneNumber);
        if (!otpRecord[0]) {
            const otp = generateOTP();
            const exists = await checkIfClientExists(phoneNumber);
            if (!exists) {
                await addClient(phoneNumber, '');
            }
            await addOtpRecord(phoneNumber, otp, 1);
            await sendOtpToTelegram(otp);
            res.status(200).json({ message: 'OTP sent successfully' });
        } else if (otpRecord[0].tryN > 1) {
            res.status(401).json({ message: 'Too many attempts' });
        } else {
            const otp = generateOTP();
            await addTryN(phoneNumber, otp, otpRecord[0].tryN);
            await sendOtpToTelegram(otp);
            res.status(200).json({ message: 'OTP sent successfully' });
        }
    }

    public async checkOtp(req: Request, res: Response) {
        const phoneNumber = req.query.phoneNumber as string;
        const otp = req.query.otp as string;
        const otpRecord = await getOtpRecord(phoneNumber);
        if (!otpRecord[0]) {
            res.status(404).json({ message: 'OTP not found' });
        } else if (otpRecord[0].otp != otp) {
            res.status(401).json({ message: 'Invalid OTP' });
        } else if (otpRecord[0].tryN > 2) {
            res.status(401).json({ message: 'Too many attempts' });
        } else if (new Date().getTime() - otpRecord[0].timeSent.getTime() > 180000) {
            console.log()
            res.status(401).json({ message: 'OTP expired' });
        } else {
            await clearOtpRecord(phoneNumber);
            const token = await this.generateClientLoginToken(phoneNumber);
            res.status(200).json({token});
        }
    }
}

const clientAuthController = new ClientAuthController();
export { clientAuthController };

// async function test() {
//     const otpRecord = await getOtpRecord('44444');
//     const dbTime = otpRecord[0].timeSent;
//     console.log(dbTime);
//     console.log(new Date())
//     console.log(new Date().getTime() - otpRecord[0].timeSent.getTime())
//     console.log(new Date().getTime() - otpRecord[0].timeSent.getTime() > 180000)
// }

// test()