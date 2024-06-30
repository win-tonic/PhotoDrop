import dotenv from "dotenv";

dotenv.config();

const getEnvVariable = (key: string): string => {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Environment variable ${key} is missing`);
    }
    return value;
};

const SECRET_KEY = getEnvVariable('PHOTOGRAPHERS_SECRET_KEY');
const CLIENT_SECRET_KEY = getEnvVariable('CLIENTS_SECRET_KEY');

const PORT = process.env.PORT || 3000;

const DB_CONNECTION_STRING = getEnvVariable('DB_CONNECTION_STRING');

const AWS_ACCESS_KEY_ID = getEnvVariable('AWS_ACCESS_KEY_ID');
const AWS_SECRET_ACCESS_KEY = getEnvVariable('AWS_SECRET_ACCESS_KEY');
const BUCKET_NAME = getEnvVariable('BUCKET_NAME');

const STRIPE_SECRET_KEY = getEnvVariable('STRIPE_SECRET_KEY');
const STRIPE_WEBHOOK_SECRET = getEnvVariable('STRIPE_WEBHOOK_SECRET');

const TELEGRAM_BOT_TOKEN = getEnvVariable('TELEGRAM_BOT_TOKEN');
const TELEGRAM_CHAT_ID = getEnvVariable('TELEGRAM_CHAT_ID');

export {
    SECRET_KEY, CLIENT_SECRET_KEY,
    PORT,
    DB_CONNECTION_STRING,
    AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, BUCKET_NAME,
    STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET,
    TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID
};
