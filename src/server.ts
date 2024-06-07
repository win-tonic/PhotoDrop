import express, {json} from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { router } from './routes/router';

const port = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(router);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}/`);
});