import express, { Request, Response } from 'express';
import { NewFriendship } from '../database/types';
import {
    createFriendship,
    getPersonFriends,
} from '../database/repositories/friendship_repository';
import { getEnvVar } from '../services/get_env_var';
import { CurrentUser } from '../interfaces/CurrentUser';
import { verify } from 'jsonwebtoken';

export const friendshipRouter = express.Router();

friendshipRouter.get('/routes', (req: Request, res: Response) => {
    return res.json({
        routes: ['POST:create', 'GET:getFriends'],
    });
});

friendshipRouter.post('/create', create);
friendshipRouter.get('/get-friends', getFriends);

async function create(req: Request, res: Response) {
    const person_1_id: number = req.body?.person_1_id;
    const person_2_id: number = req.body?.person_2_id;

    const friendshipData: NewFriendship = {
        person_1_id: person_1_id,
        person_2_id: person_2_id,
    };

    // TODO should the query in the repository be wrapped or should callers wrap it?
    try {
        const friendship = await createFriendship(friendshipData);
        return res.json(friendship);
    } catch (err) {
        console.error(err);
        // JTODO this isn't working right.
        return res.status(400).json({
            error: {
                message: (err as Error).message,
            },
        });
    }
}

async function getFriends(req: Request, res: Response) {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.json([]);
    }

    // Don't need other checks since auth middleware means we definitely have a user.
    verify(token, getEnvVar('SECRET_KEY'), async (err, decoded) => {
        const person_id = (decoded as CurrentUser).person_id;
        return res.json(await getPersonFriends(person_id));
    });
}
