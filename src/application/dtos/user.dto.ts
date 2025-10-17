import { z } from 'zod';

export const CreateUserSchema = z.object({
    email: z.string().email('Invalid email format'),
});

export const UpdateUserSchema = z.object({
    email: z.string().email('Invalid email format').optional(),
});

export const GetUserByEmailSchema = z.object({
    email: z.string().email('Invalid email format'),
});

export const LoginSchema = z.object({
    email: z.string().email('Invalid email format'),
});

export type CreateUserDto = z.infer<typeof CreateUserSchema>;
export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
export type GetUserByEmailDto = z.infer<typeof GetUserByEmailSchema>;
export type LoginDto = z.infer<typeof LoginSchema>;
