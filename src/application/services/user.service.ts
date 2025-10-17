import { User, CreateUserData, UpdateUserData } from '../../domain/entities';
import { UserRepository } from '../../domain/repositories';
import { CreateUserDto, UpdateUserDto, GetUserByEmailDto } from '../dtos';

export class UserService {
    constructor(private readonly userRepository: UserRepository) { }

    async createUser(data: CreateUserDto): Promise<User> {
        const existingUser = await this.userRepository.findByEmail(data.email);
        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        const userData: CreateUserData = {
            email: data.email,
        };

        return await this.userRepository.create(userData);
    }

    async getUserByEmail(data: GetUserByEmailDto): Promise<User | null> {
        return await this.userRepository.findByEmail(data.email);
    }

    async getUserById(id: string): Promise<User | null> {
        return await this.userRepository.findById(id);
    }

    async updateUser(id: string, data: UpdateUserDto): Promise<User | null> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new Error('User does not exist');
        }

        if (data.email && data.email !== user.email) {
            const existingUser = await this.userRepository.findByEmail(data.email);
            if (existingUser) {
                throw new Error('Email already taken by another user');
            }
        }

        const updateData: UpdateUserData = {
            email: data.email,
        };

        return await this.userRepository.update(id, updateData);
    }

    async deleteUser(id: string): Promise<boolean> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new Error('User does not exist');
        }

        return await this.userRepository.delete(id);
    }
}
