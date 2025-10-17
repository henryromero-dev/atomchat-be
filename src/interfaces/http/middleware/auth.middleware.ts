import { Request, Response, NextFunction } from 'express';
import { JwtAuthService } from '../../../application/services/auth.service';

export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        email: string;
    };
}

export const createAuthMiddleware = (authService: JwtAuthService) => {
    return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                res.status(401).json({ error: 'Missing or invalid authorization header' });
                return;
            }

            const token = authHeader.substring(7); 
            const user = await authService.getUserFromToken(token);

            if (!user) {
                res.status(401).json({ error: 'Invalid token' });
                return;
            }

            req.user = {
                id: user.id,
                email: user.email,
            };

            next();
        } catch (error) {
            res.status(401).json({ error: 'Authentication failed' });
        }
    };
};
