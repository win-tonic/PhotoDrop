import express, { json } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { router } from './routes/router';
import dotenv from 'dotenv';
import { bot } from './services/telegramBot';
dotenv.config();

const port = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(router);

bot.on('polling_error', (error) => console.log(error));

app.listen(port, () => {  
    console.log(`Server is running on http://localhost:${port}/`);
});