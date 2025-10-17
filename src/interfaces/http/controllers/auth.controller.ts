import { Request, Response } from 'express';
import { JwtAuthService } from '../../../application/services';
import { UserService } from '../../../application/services';
import { CreateUserDto, LoginDto } from '../../../application/dtos';

// Coordinates authentication workflows such as login, registration, and identity checks.
export class AuthController {
    constructor(
        private readonly authService: JwtAuthService,
        private readonly userService: UserService
    ) {}

    async login(req: Request, res: Response): Promise<void> {
        try {
            const { email } = req.body as LoginDto;

            const emailRegex = /\S+@\S+\.\S+/;
            if (!emailRegex.test(email)) {
                res.status(400).json({ error: 'Invalid email format' });
                return;
            }

            const user = await this.userService.getUserByEmail({ email });
            if (!user) {
                // Returning 201 gives the client a clear signal to branch into registration flow.
                res.status(201).json({ error: 'User does not exists', requireRegister: true });
                return;
            }

            const token = this.authService.generateToken(user);

            res.status(200).json({ 
                message: 'User logged in', 
                accessToken: token,
                user: {
                    id: user.id,
                    email: user.email,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                }
            });
        } catch (error) {
            console.error('Error in login:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async register(req: Request, res: Response): Promise<void> {
        try {
            const { email } = req.body as CreateUserDto;

            const emailRegex = /\S+@\S+\.\S+/;
            if (!emailRegex.test(email)) {
                res.status(400).json({ error: 'Invalid email format' });
                return;
            }

            const user = await this.userService.createUser({ email });
            const token = this.authService.generateToken(user);

            res.status(201).json({ 
                message: 'User registered', 
                accessToken: token,
                user: {
                    id: user.id,
                    email: user.email,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                }
            });
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === 'User with this email already exists') {
                    res.status(400).json({ error: 'Email is already registered' });
                    return;
                }
            }
            console.error('Error in register:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async logout(_req: Request, res: Response): Promise<void> {
        try {
            res.status(200).json({ message: 'User logged out' });
        } catch (error) {
            console.error('Error in logout:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async me(req: Request, res: Response): Promise<void> {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                res.status(401).json({ error: 'Authorization header required' });
                return;
            }

            const token = authHeader.substring(7);
            const payload = this.authService.verifyToken(token);
            if (!payload) {
                res.status(401).json({ error: 'Invalid token' });
                return;
            }

            const user = await this.userService.getUserById(payload.userId);
            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }

            res.json({
                id: user.id,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            });
        } catch (error) {
            console.error('Error in me:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}
