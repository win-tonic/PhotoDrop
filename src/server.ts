import express from 'express';
import cors from 'cors';
import { router } from './routes/router';
import { customBodyParser } from './middleware/bodyParser';
import { PORT } from './config/config';

const app = express();
app.use(cors());
app.use(customBodyParser)
app.use(router);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/`);
});