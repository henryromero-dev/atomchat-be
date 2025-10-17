import { z } from 'zod';

export const CreateTaskSchema = z.object({
    title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
    description: z.string().max(1000, 'Description too long').optional(),
    userId: z.string().min(1, 'User ID is required'),
});

export const UpdateTaskSchema = z.object({
    title: z.string().min(1, 'Title is required').max(200, 'Title too long').optional(),
    description: z.string().max(1000, 'Description too long').optional(),
    completed: z.boolean().optional(),
});

export const TaskParamsSchema = z.object({
    id: z.string().min(1, 'Task ID is required'),
});

export type CreateTaskDto = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskDto = z.infer<typeof UpdateTaskSchema>;
export type TaskParamsDto = z.infer<typeof TaskParamsSchema>;
