import { Request, Response, Application, Router } from 'express';

require('dotenv').config();

const express = require('express');
const app: Application = express();
const testRoutes: Router = require('./routes/test_routes');
const port = process.env.APP_PORT;

app.get("/", (req: Request, res: Response) => {
  return res.json({ message: "Hello world!!" });
});

app.use('/test', testRoutes);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
