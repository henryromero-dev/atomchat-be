import * as jwt from 'jsonwebtoken';
import { User } from '../../domain/entities';
import { UserRepository } from '../../domain/repositories';

export interface AuthService {
    generateToken(user: User): string;
    verifyToken(token: string): { userId: string; email: string } | null;
}

export class JwtAuthService implements AuthService {
    private readonly secret: string;

    constructor(
        private readonly userRepository: UserRepository,
        secret?: string
    ) {
        this.secret = secret || process.env['JWT_SECRET'] || '';
    }

    generateToken(user: User): string {
        const payload = {
            userId: user.id,
            email: user.email,
        };

        return jwt.sign(payload, this.secret, { expiresIn: '24h' });
    }

    verifyToken(token: string): { userId: string; email: string } | null {
        try {
            const decoded = jwt.verify(token, this.secret) as any;
            return {
                userId: decoded.userId,
                email: decoded.email,
            };
        } catch (error) {
            return null;
        }
    }

    async getUserFromToken(token: string): Promise<User | null> {
        const payload = this.verifyToken(token);
        if (!payload) {
            return null;
        }

        return await this.userRepository.findById(payload.userId);
    }
}
