import express, { Request, Response, Router } from 'express';
import { getNumber } from '../services/number_gen_service';

const dbInMem: any = {};
const numberRouter: Router = express.Router();

numberRouter.get('/routes', (req: Request, res: Response) => {
    dbInMem['number'] = getNumber();
    return res.json({ routes: ['new', 'previous'] });
});

numberRouter.post('/new', (req: Request, res: Response) => {
    dbInMem['number'] = getNumber();
    return res.json({ number: dbInMem['number'] });
});

numberRouter.get('/previous', (req: Request, res: Response) => {
    const result =
        dbInMem['number'] == null ? 'No number set' : dbInMem['number'];
    return res.json({ number: result });
});

export { numberRouter };
