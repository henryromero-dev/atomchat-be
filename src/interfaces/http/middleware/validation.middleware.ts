import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export const validateBody = (schema: z.ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            req.body = schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({
                    error: 'Validation error',
                    details: error.errors.map(err => ({
                        field: err.path.join('.'),
                        message: err.message,
                    })),
                });
                return;
            }
            res.status(400).json({ error: 'Invalid request body' });
        }
    };
};

export const validateQuery = (schema: z.ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            req.query = schema.parse(req.query);
            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({
                    error: 'Validation error',
                    details: error.errors.map(err => ({
                        field: err.path.join('.'),
                        message: err.message,
                    })),
                });
                return;
            }
            res.status(400).json({ error: 'Invalid query parameters' });
        }
    };
};

export const validateParams = (schema: z.ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            req.params = schema.parse(req.params);
            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({
                    error: 'Validation error',
                    details: error.errors.map(err => ({
                        field: err.path.join('.'),
                        message: err.message,
                    })),
                });
                return;
            }
            res.status(400).json({ error: 'Invalid path parameters' });
        }
    };
};
