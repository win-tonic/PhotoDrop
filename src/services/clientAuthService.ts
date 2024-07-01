import { addOtpRecord, getOtpRecord, clearOtpRecord, addTryN, checkIfClientExists, addClient, getClientInfo } from '../db/dbInteractions/dbClientAuth';
import { sendOtpToTelegram } from '../services/telegramBot';
import { generateOTP } from '../utilities/utilities';
import { CLIENT_SECRET_KEY } from '../config/config';
import jwt from 'jsonwebtoken';
import { CustomError } from '../middleware/errorHandler';

class ClientAuthService {
    public async generateClientLoginToken(phone: string): Promise<string> {
        const userInfo = await getClientInfo(phone);
        return jwt.sign(userInfo, CLIENT_SECRET_KEY, { expiresIn: '1d' });
    }

    public async sendOtp(phoneNumber: string): Promise<string> {
        const otpRecord = await getOtpRecord(phoneNumber);
        if (!otpRecord[0]) {
            const otp = generateOTP();
            const exists = await checkIfClientExists(phoneNumber);
            if (!exists) {
                await addClient(phoneNumber, '');
            }
            await addOtpRecord(phoneNumber, otp, 1);
            await sendOtpToTelegram(otp);
            return 'OTP sent successfully';
        } else if (otpRecord[0].tryN > 1) {
            throw new CustomError('Too many attempts', 401);
        } else {
            const otp = generateOTP();
            await addTryN(phoneNumber, otp, otpRecord[0].tryN);
            await sendOtpToTelegram(otp);
            return 'OTP sent successfully';
        }
    }

    public async checkOtp(phoneNumber: string, otp: string): Promise<string> {
        const otpRecord = await getOtpRecord(phoneNumber);
        if (!otpRecord[0]) {
            throw new CustomError('OTP not found', 404);
        } else if (otpRecord[0].otp !== otp) {
            throw new CustomError('Invalid OTP', 401);
        } else if (otpRecord[0].tryN > 2) {
            throw new CustomError('Too many attempts', 401);
        } else if (new Date().getTime() - otpRecord[0].timeSent.getTime() > 180000) {
            throw new CustomError('OTP expired', 401);
        } else {
            await clearOtpRecord(phoneNumber);
            return this.generateClientLoginToken(phoneNumber);
        }
    }
}

const clientAuthService = new ClientAuthService();
export { clientAuthService };
