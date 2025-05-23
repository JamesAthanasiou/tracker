import { NextFunction, Request, Response } from 'express';
import { logStream } from '../middleware/logger';

// Error handling
export const logError = (err: any, req: Request, res: Response, next: NextFunction) => {
    const errorMessage = `${new Date().toISOString()} - ${req.method} ${req.url} - ${err.message}\n`;
    console.error(errorMessage);
    logStream.write(errorMessage);
    next(err);
};

export const notFoundError = (req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({ message: 'Not Found' })
}

export const generalError = (err: any, req: Request, res: Response, next: NextFunction) => {
    res.status(err.status || 500).json({
        message: err.message || 'Server error',
    });
}