import { Router } from 'express';
import { TaskController } from '../controllers';
import { createAuthMiddleware } from '../middleware';
import { validateBody, validateParams } from '../middleware';
import { CreateTaskSchema, UpdateTaskSchema } from '../../../application/dtos';
import { z } from 'zod';

const taskParamsSchema = z.object({
    id: z.string().min(1, 'Task ID is required'),
});

const userTasksParamsSchema = z.object({
    userId: z.string().min(1, 'User ID is required'),
});

export const createTaskRoutes = (
    taskController: TaskController,
    authMiddleware: ReturnType<typeof createAuthMiddleware>
): Router => {
    const router = Router();

    router.get(
        '/',
        authMiddleware,
        taskController.getTasks.bind(taskController)
    );

    router.post(
        '/',
        authMiddleware,
        validateBody(CreateTaskSchema.omit({ userId: true })), 
        taskController.createTask.bind(taskController)
    );

    router.get(
        '/:id',
        authMiddleware,
        validateParams(taskParamsSchema),
        taskController.getTaskById.bind(taskController)
    );

    router.get(
        '/user/:userId',
        validateParams(userTasksParamsSchema),
        taskController.getTasksByUserId.bind(taskController)
    );

    router.patch(
        '/:id',
        authMiddleware,
        validateParams(taskParamsSchema),
        validateBody(UpdateTaskSchema),
        taskController.updateTask.bind(taskController)
    );

    router.delete(
        '/:id',
        authMiddleware,
        validateParams(taskParamsSchema),
        taskController.deleteTask.bind(taskController)
    );

    return router;
};
