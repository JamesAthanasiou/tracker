// TODO, move user creation in here or no?
import express, { NextFunction, Request, Response } from 'express';
import { findOrFailUserByUsername } from '../database/repositories/user_repository';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { getEnvVar } from '../services/get_env_var';
import { CurrentUser } from '../interfaces/CurrentUser';

export const authRouter = express.Router();

authRouter.post('/login', login);

// TODO add refresh tokens
export const tokenExpireTime = '1h';

// TODO review next function.
export async function login(req: Request, res: Response, next: NextFunction) {
    try {
        const user = await findOrFailUserByUsername(req.body.username);
        const isMatch = await compare(req.body.password, user.password);

        if (!isMatch) {
            throw Error('Invalid email and/or password');
        }

        const currentUser: CurrentUser = { id: user.id, username: user.username }

        const token = sign(
            currentUser,
            getEnvVar('SECRET_KEY'),
            // {
            //     expiresIn: tokenExpireTime
            // }
        );

        return res.json({
            user: user,
            token: token,
        });
    } catch {
        return next({
            status: 400,
            message: 'Invalid username and/or password',
        });
    }
}
