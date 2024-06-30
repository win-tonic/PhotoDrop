import TelegramBot from 'node-telegram-bot-api';
import { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } from '../config/config';

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN);

const sendOtpToTelegram = async (otp: string): Promise<void> => {
    const message = `Your OTP is: ${otp}`;
    try {
        await bot.sendMessage(parseInt(TELEGRAM_CHAT_ID), message);
        console.log('OTP sent to Telegram successfully.');
    } catch (error) {
        console.error('Failed to send OTP to Telegram:', error);
    }
};

export { sendOtpToTelegram, bot };