import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { initializeFirestore } from './infrastructure/database/firestore.config';
import { FirestoreUserRepository, FirestoreTaskRepository } from './infrastructure/repositories';
import { UserService, TaskService, JwtAuthService } from './application/services';
import { UserController, TaskController, AuthController } from './interfaces/http/controllers';
import { createUserRoutes, createTaskRoutes, createAuthRoutes } from './interfaces/http/routes';
import { createAuthMiddleware, errorHandler } from './interfaces/http/middleware';

export const createApp = (): express.Application => {
    initializeFirestore();

    const userRepository = new FirestoreUserRepository();
    const taskRepository = new FirestoreTaskRepository();

    const userService = new UserService(userRepository);
    const taskService = new TaskService(taskRepository, userRepository);
    const authService = new JwtAuthService(userRepository);

    const userController = new UserController(userService);
    const taskController = new TaskController(taskService);
    const authController = new AuthController(authService, userService);

    const authMiddleware = createAuthMiddleware(authService);

    const app = express();

    app.use(helmet());
    app.use(cors({
        origin: process.env['CORS_ORIGIN'] || '*',
        credentials: true,
    }));

    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true }));

    app.get('/health', (_req: express.Request, res: express.Response) => {
        res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    app.use('/api/auth', createAuthRoutes(authController, authMiddleware));
    app.use('/api/users', createUserRoutes(userController, authMiddleware));
    app.use('/api/tasks', createTaskRoutes(taskController, authMiddleware));

    app.use(errorHandler);

    return app;
};
