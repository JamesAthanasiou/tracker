import express, { Request, Response, Application, NextFunction } from 'express';
import { numberRouter } from './routes/number_routes';
import 'dotenv/config';
import { personRouter } from './routes/person_routes';
import bodyParser from 'body-parser';
import cors from 'cors';
import { friendshipRouter } from './routes/friendship_routes';
import { userRouter } from './routes/user_routes';
import { authRouter } from './routes/login_routes';
import { authenticateToken } from './middleware/auth';
import { pinoHttp } from 'pino-http';
import { logger } from './middleware/logger';
import { generalError, logError, notFoundError } from './utils/error_handler';

const app: Application = express();
const port = process.env.APP_PORT ?? 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(pinoHttp({ logger }));

// Routes
app.use('/number', numberRouter);
app.use('/person', personRouter);
app.use('/friendship', authenticateToken, friendshipRouter);
app.use('/user', userRouter);
app.use('/', authRouter);

// Error handling
app.use(logError);
app.use(notFoundError);
app.use(generalError);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
