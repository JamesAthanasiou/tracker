import express, { Request, Response, Router } from 'express';

const dbInMem: any = {};
const numberRouter: Router = express.Router();

const numberServiceUrl = process.env.NUMBER_SERVICE_URL || '';

numberRouter.get('/get-number', async (req: Request, res: Response) => {
    try {
        console.log('getting number');

        const response = await fetch(`${numberServiceUrl}/number`);
        if (!response.ok) {
            throw new Error(`Spring Boot service returned ${response.status}`);
        }
    
        const data = await response.json();
        res.json(data);
        console.log(data);
    } catch (error: any) {
        console.error('Error calling Spring Boot service:', error.message);
        res.status(500).json({ error: 'Failed to fetch data from number service' });
    }
});

export { numberRouter };
