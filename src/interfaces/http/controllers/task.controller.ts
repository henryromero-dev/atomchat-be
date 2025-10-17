import { Request, Response } from 'express';
import { TaskService } from '../../../application/services';
import { CreateTaskDto, UpdateTaskDto } from '../../../application/dtos';
import { AuthenticatedRequest } from '../middleware';

// Handles task endpoints and enforces per-user access controls.
export class TaskController {
    constructor(private readonly taskService: TaskService) { }

    async createTask(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const taskData = req.body as CreateTaskDto;
            // Ensure tasks are always scoped to the authenticated user regardless of payload.
            taskData.userId = req.user!.id;

            const task = await this.taskService.createTask(taskData);
            res.status(201).json(task);
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === 'User not found') {
                    res.status(404).json({ error: error.message });
                    return;
                }
            }
            console.error('Error in createTask:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getTasks(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const tasks = await this.taskService.getTasksByUserId(req.user!.id);
            res.json(tasks);
        } catch (error) {
            console.error('Error in getTasks:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getTaskById(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(400).json({ error: 'Task ID is required' });
                return;
            }
            const task = await this.taskService.getTaskById(id);

            if (!task) {
                res.status(404).json({ error: 'Task not found' });
                return;
            }

            // Only the owner of the task can view the record.
            if (task.userId !== req.user!.id) {
                res.status(403).json({ error: 'Access denied. You can only access your own tasks.' });
                return;
            }

            res.json(task);
        } catch (error) {
            console.error('Error in getTaskById:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getTasksByUserId(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.params;
            if (!userId) {
                res.status(400).json({ error: 'User ID is required' });
                return;
            }
            const tasks = await this.taskService.getTasksByUserId(userId);
            res.json(tasks);
        } catch (error) {
            console.error('Error in getTasksByUserId:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async updateTask(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(400).json({ error: 'Task ID is required' });
                return;
            }

            const existingTask = await this.taskService.getTaskById(id);
            if (!existingTask) {
                res.status(404).json({ error: 'Task not found' });
                return;
            }

            // Reject attempts to update tasks that belong to another user.
            if (existingTask.userId !== req.user!.id) {
                res.status(403).json({ error: 'Access denied. You can only update your own tasks.' });
                return;
            }

            const taskData = req.body as UpdateTaskDto;
            const task = await this.taskService.updateTask(id, taskData);

            res.json(task);
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === 'Task not found') {
                    res.status(404).json({ error: error.message });
                    return;
                }
            }
            console.error('Error in updateTask:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async deleteTask(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(400).json({ error: 'Task ID is required' });
                return;
            }

            const existingTask = await this.taskService.getTaskById(id);
            if (!existingTask) {
                res.status(404).json({ error: 'Task not found' });
                return;
            }

            // Prevent cross-user deletions by checking the task owner first.
            if (existingTask.userId !== req.user!.id) {
                res.status(403).json({ error: 'Access denied. You can only delete your own tasks.' });
                return;
            }

            await this.taskService.deleteTask(id);
            res.status(204).send();
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === 'Task not found') {
                    res.status(404).json({ error: error.message });
                    return;
                }
            }
            console.error('Error in deleteTask:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}
