import { Request, Response } from 'express';
import { UserService } from '../../../application/services';
import { CreateUserDto, UpdateUserDto, GetUserByEmailDto } from '../../../application/dtos';
import { AuthenticatedRequest } from '../middleware';

// Exposes CRUD endpoints for user accounts and maps errors to HTTP responses.
export class UserController {
    constructor(private readonly userService: UserService) { }

    async createUser(req: Request, res: Response): Promise<void> {
        try {
            const userData = req.body as CreateUserDto;
            const user = await this.userService.createUser(userData);
            res.status(201).json(user);
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === 'User with this email already exists') {
                    // Conflict hints the client to prompt for login instead of registration.
                    res.status(409).json({ error: error.message });
                    return;
                }
            }
            throw error;
        }
    }

    async getUserByEmail(req: Request, res: Response): Promise<void> {
        try {
            const { email } = req.query as { email: string };
            const userData: GetUserByEmailDto = { email };
            const user = await this.userService.getUserByEmail(userData);

            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }

            res.json(user);
        } catch (error) {
            console.error('Error in getUserByEmail:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getUserById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(400).json({ error: 'User ID is required' });
                return;
            }
            const user = await this.userService.getUserById(id);

            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }

            res.json(user);
        } catch (error) {
            console.error('Error in getUserById:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async updateUser(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(400).json({ error: 'User ID is required' });
                return;
            }
            const userData = req.body as UpdateUserDto;
            const user = await this.userService.updateUser(id, userData);

            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }

            res.json(user);
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === 'User not found') {
                    res.status(404).json({ error: error.message });
                    return;
                }
                if (error.message === 'Email already taken by another user') {
                    res.status(409).json({ error: error.message });
                    return;
                }
            }
            console.error('Error in updateUser:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async deleteUser(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(400).json({ error: 'User ID is required' });
                return;
            }
            const success = await this.userService.deleteUser(id);

            if (!success) {
                res.status(404).json({ error: 'User not found' });
                return;
            }

            res.status(204).send();
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === 'User not found') {
                    res.status(404).json({ error: error.message });
                    return;
                }
            }
            console.error('Error in deleteUser:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}
