import express, { Request, Response, Application } from 'express';
import { numberRouter } from './routes/number_routes';
import 'dotenv/config';
import { personRouter } from './routes/person_routes';
import bodyParser from 'body-parser';

const app: Application = express();
const port = process.env.APP_PORT ?? 3000;

app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
  return res.json({ message: "I am nice and work in a docker container" });
});

app.use('/number', numberRouter);
app.use('/person', personRouter);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
