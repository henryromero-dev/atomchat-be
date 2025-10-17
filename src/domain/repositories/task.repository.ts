import { Task, CreateTaskData, UpdateTaskData } from '../entities';

export interface TaskRepository {
    findById(id: string): Promise<Task | null>;
    findByUserId(userId: string): Promise<Task[]>;
    findAll(): Promise<Task[]>;
    create(data: CreateTaskData): Promise<Task>;
    update(id: string, data: UpdateTaskData): Promise<Task | null>;
    delete(id: string): Promise<boolean>;
}
