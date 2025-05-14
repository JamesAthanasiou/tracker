import express, { Request, Response, Router } from 'express';
import {
    createPerson,
    deletePerson,
    findPeople,
    findPersonById,
} from '../database/repositories/person_repository';
import { NewPerson } from '../database/types';
import { deletePersonFriendships } from '../database/repositories/friendship_repository';

const personRouter: Router = express.Router();

personRouter.get('/routes', (req: Request, res: Response) => {
    return res.json({
        routes: ['GET:show-all', 'POST:create'],
    });
});

personRouter.get('/show-all', showAll);
personRouter.post('/create', create);
personRouter.get('/:person_id', show);
personRouter.post('/delete', del);

async function show(req: Request, res: Response) {
    const person_id = req.params?.person_id;

    if (!person_id) {
        throw Error('No ID provided');
    }

    return res.json(await findPersonById(parseInt(person_id)));
}

// TODO this requires a db to be running. Add a working db to docker compose so we can run it on the ec2 instance.
async function create(req: Request, res: Response) {
    // TODO add request validation.
    const gender: 'man' | 'woman' | 'other' = req.body?.gender;
    const first_name: string = req.body?.first_name;
    const last_name: string = req.body?.last_name;

    let personData: NewPerson | null = null;

    personData = {
        gender: gender,
        first_name: first_name,
        last_name: last_name,
    };

    const person = await createPerson(personData);
    return res.json(person);
}

async function del(req: Request, res: Response) {
    const person_id: number = req.body?.id;
    await deletePersonFriendships(person_id);

    return res.json(await deletePerson(person_id));
}

// TODO move into new service/handler/controller?
async function showAll(req: Request, res: Response) {
    // TODO add error handling
    const people = await findPeople({});
    return res.json(people);
}

export { personRouter };
