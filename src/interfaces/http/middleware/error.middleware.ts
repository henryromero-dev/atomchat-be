import { Request, Response, NextFunction } from 'express';

// Centralised error handler maps known business errors to HTTP responses.
export const errorHandler = (
    error: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {
    console.error('Error:', error);

    if (error.message === 'User does not exist' || error.message === 'Task does not exist') {
        res.status(404).json({ error: error.message });
        return;
    }

    if (error.message === 'User with this email already exists' ||
        error.message === 'Email already taken by another user') {
        res.status(409).json({ error: error.message });
        return;
    }

    res.status(500).json({
        error: 'Internal server error',
        message: process.env['NODE_ENV'] === 'development' ? error.message : 'Something went wrong'
    });
};
