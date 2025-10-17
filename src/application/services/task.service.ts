import { Task, CreateTaskData, UpdateTaskData } from '../../domain/entities';
import { TaskRepository, UserRepository } from '../../domain/repositories';
import { CreateTaskDto, UpdateTaskDto } from '../dtos';

export class TaskService {
    constructor(
        private readonly taskRepository: TaskRepository,
        private readonly userRepository: UserRepository
    ) { }

    async createTask(data: CreateTaskDto): Promise<Task> {
        const user = await this.userRepository.findById(data.userId);
        if (!user) {
            throw new Error('User does not exist');
        }

        const taskData: CreateTaskData = {
            title: data.title,
            description: data.description,
            userId: data.userId,
        };

        return await this.taskRepository.create(taskData);
    }

    async getTasks(): Promise<Task[]> {
        return await this.taskRepository.findAll();
    }

    async getTaskById(id: string): Promise<Task | null> {
        return await this.taskRepository.findById(id);
    }

    async getTasksByUserId(userId: string): Promise<Task[]> {
        return await this.taskRepository.findByUserId(userId);
    }

    async updateTask(id: string, data: UpdateTaskDto): Promise<Task | null> {
        const task = await this.taskRepository.findById(id);
        if (!task) {
            throw new Error('Task does not exist');
        }

        const updateData: UpdateTaskData = {
            title: data.title,
            description: data.description,
            completed: data.completed,
        };

        return await this.taskRepository.update(id, updateData);
    }

    async deleteTask(id: string): Promise<boolean> {
        const task = await this.taskRepository.findById(id);
        if (!task) {
            throw new Error('Task does not exist');
        }

        return await this.taskRepository.delete(id);
    }
}
