import express, {json} from 'express';
import cors from 'cors';
import { router } from './routes/router';

const port = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(json());
app.use(router);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}/`);
});