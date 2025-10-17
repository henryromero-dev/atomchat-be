import { Router } from 'express';
import { AuthController } from '../controllers';
import { createAuthMiddleware } from '../middleware';
import { validateBody } from '../middleware';
import { CreateUserSchema, LoginSchema } from '../../../application/dtos';

export const createAuthRoutes = (
    authController: AuthController,
    authMiddleware: ReturnType<typeof createAuthMiddleware>
): Router => {
    const router = Router();

    router.post(
        '/register',
        validateBody(CreateUserSchema),
        authController.register.bind(authController)
    );

    router.post(
        '/login',
        validateBody(LoginSchema),
        authController.login.bind(authController)
    );

    router.post(
        '/logout',
        authMiddleware,
        authController.logout.bind(authController)
    );

    router.get(
        '/me',
        authMiddleware,
        authController.me.bind(authController)
    );

    return router;
};
