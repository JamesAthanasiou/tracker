import express, { Request, Response, Router } from 'express';
import { createPerson } from '../database/repositories/person_repository';
import { NewPerson, NewUser } from '../database/types';
import {
    createUser,
    findUserById,
} from '../database/repositories/user_repository';
import { hash } from 'bcrypt';

const userRouter: Router = express.Router();

userRouter.post('/create', create);
userRouter.get('/:id', get);

async function create(req: Request, res: Response) {
    // When we create a user, we also create a person. User cannot use existing person for now.
    const personData: NewPerson = {
        gender: req.body.person.gender,
        first_name: req.body.person.first_name,
        last_name: req.body.person.last_name,
    };

    const person = await createPerson(personData);

    const username: string = req.body.username;
    // TODO, look more into auth. Don't feel like we should be passing in a raw password over http.
    // TOOD, checkout argon2 instead of bcrypt?
    const hashCycles = 10;
    // TODO when checking password use bcrypt's compare. Related: where should that function go?
    const password: string = await hash(req.body.password, hashCycles);

    const userData: NewUser = {
        username: username,
        password: password,
        person_id: person.id,
    };

    const user = await createUser(userData);

    return res.json(user);
}

async function get(req: Request, res: Response) {
    const userId = Number(req.params.id);

    return await res.json(findUserById(userId));
}

export { userRouter };
