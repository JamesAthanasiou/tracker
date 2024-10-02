import express, { Request, Response, Application, Router } from 'express';
import { numberRouter } from './routes/number_routes';
import 'dotenv/config';

const app: Application = express();
const port = process.env.APP_PORT ?? 3000;

app.get("/", (req: Request, res: Response) => {
  return res.json({ message: "I am nice and work in a docker container" });
});

app.use('/number', numberRouter);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
