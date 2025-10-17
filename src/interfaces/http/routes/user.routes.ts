import { Router } from 'express';
import { UserController } from '../controllers';
import { createAuthMiddleware } from '../middleware';
import { validateBody, validateQuery, validateParams } from '../middleware';
import { CreateUserSchema, UpdateUserSchema, GetUserByEmailSchema } from '../../../application/dtos';
import { z } from 'zod';

const userParamsSchema = z.object({
    id: z.string().min(1, 'User ID is required'),
});

export const createUserRoutes = (
    userController: UserController,
    authMiddleware: ReturnType<typeof createAuthMiddleware>
): Router => {
    const router = Router();

    router.post(
        '/',
        validateBody(CreateUserSchema),
        userController.createUser.bind(userController)
    );

    router.get(
        '/',
        validateQuery(GetUserByEmailSchema),
        userController.getUserByEmail.bind(userController)
    );

    router.get(
        '/:id',
        validateParams(userParamsSchema),
        userController.getUserById.bind(userController)
    );

    router.patch(
        '/:id',
        authMiddleware,
        validateParams(userParamsSchema),
        validateBody(UpdateUserSchema),
        userController.updateUser.bind(userController)
    );

    router.delete(
        '/:id',
        authMiddleware,
        validateParams(userParamsSchema),
        userController.deleteUser.bind(userController)
    );

    return router;
};
