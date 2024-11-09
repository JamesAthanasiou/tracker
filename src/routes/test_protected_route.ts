import express, { Request, Response, Router } from 'express';

const testProtectedRouter: Router = express.Router();

testProtectedRouter.get('/test', (req: Request, res: Response) => {
    return res.json({
        'wow':'wow',
    });
});

export { testProtectedRouter };
