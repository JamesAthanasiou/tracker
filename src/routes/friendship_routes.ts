import express, { Request, Response } from 'express';
import { NewFriendship } from '../database/types';
import { createFriendship } from '../database/repositories/friendship_repository';

export const friendshipRouter = express.Router();

friendshipRouter.get('/routes', (req: Request, res: Response) => {
    return res.json({
        routes: ['GET:show-all', 'POST:create'],
    });
});

// friendshipRouter.get('/show-all', showAll);
friendshipRouter.post('/create', create);

async function create(req: Request, res: Response) {
    const person_1_id: number = req.body?.person_1_id;
    const person_2_id: number = req.body?.person_2_id;

    const friendshipData: NewFriendship = {
        person_1_id: person_1_id,
        person_2_id: person_2_id,
    };

    const friendship = await createFriendship(friendshipData);
    return res.json(friendship);
}
