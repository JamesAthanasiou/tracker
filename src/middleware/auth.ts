import { JwtPayload, verify } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { getEnvVar } from '../services/get_env_var';

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const token = req.header('Authorization');

    if (!token) return res.status(401).json({ error: 'Access denied' });
    try {
        verify(token, getEnvVar('SECRET_KEY'), (err) => {

            if (err) {
                return res.sendStatus(403)
            }
    
            next();
        });
    } catch {
        res.status(401).json({ error: 'Access denied' });
    }
}

// TODO test
export function checkUserAuthorized(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const token = req.header('Authorization');

        if (!token) return res.status(401).json({ error: 'Access denied' });

        verify(token, getEnvVar('SECRET_KEY'), function (err, decoded) {
            if (decoded && (decoded as JwtPayload).id === req.params.id) {
                return next();
            } else {
                return next({
                    status: 401,
                    message: 'You are unauthorized to do that',
                });
            }
        });
    } catch (err) {
        // TODO error logging?
        console.log(err);
        return next({
            status: 401,
            message: 'You are unauthorized to do that',
        });
    }
}
