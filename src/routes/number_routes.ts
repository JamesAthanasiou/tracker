import express, { Request, Response, Router } from 'express';
import { db_in_mem } from '../database/in_memory_db';
import { getNumber } from '../service/number_gen_service';

const dbInMem: any = db_in_mem;
const numberRouter: Router = express.Router();

numberRouter.get("/", (req: Request, res: Response) => {
  dbInMem['number'] = getNumber();
  return res.json({ routes: ['new', 'previous' ] });
});

numberRouter.post("/new", (req: Request, res: Response) => {
  dbInMem['number'] = getNumber();
  return res.json({ number: dbInMem['number'] });
});

numberRouter.get("/previous", (req: Request, res: Response) => {
  const result = dbInMem['number'] == null ? 'No number set' : dbInMem['number'];
  return res.json({ number: result });
});

export { numberRouter };
