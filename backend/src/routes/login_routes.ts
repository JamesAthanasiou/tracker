// TODO, move user creation in here or no?
import express, { NextFunction, Request, Response } from 'express';
import { findOrFailUserByUsername } from '../database/repositories/user_repository';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { getEnvVar } from '../services/get_env_var';
import { CurrentUser } from '../interfaces/CurrentUser';
import { InvalidLoginError } from '../error/InvalidLoginError';

export const authRouter = express.Router();

authRouter.post('/login', login);

// TODO add refresh tokens
export const tokenExpireTime = '1h';

export async function login(req: Request, res: Response, next: NextFunction) {
    try {
        const user = await findOrFailUserByUsername(req.body.username);
        const isMatch = await compare(req.body.password, user.password);
        if (!isMatch) {
            throw new Error();
        }

        const currentUser: CurrentUser = {
            id: user.id,
            person_id: user.person_id,
            username: user.username,
        };

        const token = sign(
            currentUser,
            getEnvVar('SECRET_KEY')
            // {
            //     expiresIn: tokenExpireTime
            // }
        );

        return res.json({
            user: user,
            token: token,
        });
    } catch {
        next(new InvalidLoginError('Invalid email and/or password'));
        return;
    }
}

// No logout route because we're using JWT, so only data is on client.
