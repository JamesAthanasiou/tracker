import express, { Request, Response, Router } from 'express';
import {
    createPerson,
    findPeople,
} from '../database/repositories/person_repository';
import { NewPerson } from '../database/types';

const personRouter: Router = express.Router();

personRouter.get('/routes', (req: Request, res: Response) => {
    return res.json({
        routes: ['GET:show-all', 'POST:create', 'POST:update', 'POST:remove'],
    });
});

personRouter.get('/show-all', showAll);
personRouter.post('/create', create);

// TODO this requires a db to be running. Add a working db to docker compose so we can run it on the ec2 instance.
async function create(req: Request, res: Response) {
    // TODO add request validation.
    const gender: 'man' | 'woman' | 'other' = req.body?.gender;
    const first_name: string = req.body?.first_name;
    const last_name: string = req.body?.last_name;

    let personData: NewPerson | null = null;

    if (!gender && !first_name) {
        // Default for now. TODO, change. Definitely not the actual behaviour we want.
        personData = {
            gender: 'man',
            first_name: 'John',
            last_name: 'Doe',
        };
    } else {
        personData = {
            gender: gender,
            first_name: first_name,
            last_name: last_name,
        };
    }

    const person = await createPerson(personData);
    return res.json(person);
}

// TODO move into new service/handler/controller?
async function showAll(req: Request, res: Response) {
    // TODO add error handling
    const people = await findPeople({});
    return res.json(people);
}

export { personRouter };
