import { User, CreateUserData, UpdateUserData } from '../entities';

export interface UserRepository {
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    create(data: CreateUserData): Promise<User>;
    update(id: string, data: UpdateUserData): Promise<User | null>;
    delete(id: string): Promise<boolean>;
}
