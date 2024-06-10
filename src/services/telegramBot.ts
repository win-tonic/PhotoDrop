import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';

dotenv.config();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN as string;
const TELEGRAM_CHAT_ID = parseInt(process.env.TELEGRAM_CHAT_ID as string, 10);

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN);

const sendOtpToTelegram = async (otp: string): Promise<void> => {
    const message = `Your OTP is: ${otp}`;
    try {
        await bot.sendMessage(TELEGRAM_CHAT_ID, message);
        console.log('OTP sent to Telegram successfully.');
    } catch (error) {
        console.error('Failed to send OTP to Telegram:', error);
    }
};

export { sendOtpToTelegram, bot };