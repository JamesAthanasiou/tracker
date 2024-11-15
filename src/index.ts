import express, { Request, Response, Application } from 'express';
import { numberRouter } from './routes/number_routes';
import 'dotenv/config';
import { personRouter } from './routes/person_routes';
import bodyParser from 'body-parser';
import cors from 'cors';
import { friendshipRouter } from './routes/friendship_routes';
import { userRouter } from './routes/user_routes';
import { authRouter } from './routes/login_routes';
import { authenticateToken } from './middleware/auth';

const app: Application = express();
const port = process.env.APP_PORT ?? 3000;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req: Request, res: Response) => {
    return res.json({ message: 'I am nice and work in a docker container' });
});

app.use('/number', numberRouter);
app.use('/person', personRouter);
app.use('/friendship', authenticateToken, friendshipRouter);
app.use('/user', userRouter);
app.use('/', authRouter);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
