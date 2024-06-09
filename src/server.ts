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
    setInterval(() => {
        const used = process.memoryUsage();
        console.log(`Memory usage:
          RSS=${(used.rss / 1024 / 1024).toFixed(2)}MB,
          HeapTotal=${(used.heapTotal / 1024 / 1024).toFixed(2)}MB,
          HeapUsed=${(used.heapUsed / 1024 / 1024).toFixed(2)}MB,
          External=${(used.external / 1024 / 1024).toFixed(2)}MB,
          ArrayBuffers=${(used.arrayBuffers / 1024 / 1024).toFixed(2)}MB`);
      }, 10000);
      
    console.log(`Server is running on http://localhost:${port}/`);
});