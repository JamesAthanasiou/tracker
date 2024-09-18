import express from 'express';
import { Request, Response } from 'express';

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  return res.json({ message: "Hello world!!!" });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});