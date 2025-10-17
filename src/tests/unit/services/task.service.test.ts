import { TaskService } from '../../../application/services/task.service';
import { TaskRepository, UserRepository } from '../../../domain/repositories';
import { Task, User } from '../../../domain/entities';

describe('TaskService', () => {
  let taskService: TaskService;
  let mockTaskRepository: jest.Mocked<TaskRepository>;
  let mockUserRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockTaskRepository = {
      findById: jest.fn(),
      findByUserId: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    mockUserRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    taskService = new TaskService(mockTaskRepository, mockUserRepository);
  });

  describe('createTask', () => {
    it('should create a new task successfully', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        userId: 'user1',
      };

      const user: User = {
        id: 'user1',
        email: 'test@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const createdTask: Task = {
        id: '1',
        title: 'Test Task',
        description: 'Test Description',
        completed: false,
        userId: 'user1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserRepository.findById.mockResolvedValue(user);
      mockTaskRepository.create.mockResolvedValue(createdTask);

      const result = await taskService.createTask(taskData);

      expect(mockUserRepository.findById).toHaveBeenCalledWith('user1');
      expect(mockTaskRepository.create).toHaveBeenCalledWith(taskData);
      expect(result).toEqual(createdTask);
    });

    it('should throw error if user not found', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        userId: 'user1',
      };

      mockUserRepository.findById.mockResolvedValue(null);

      await expect(taskService.createTask(taskData)).rejects.toThrow('User does not exist');
    });
  });

  describe('getTasks', () => {
    it('should return all tasks', async () => {
      const tasks: Task[] = [
        {
          id: '1',
          title: 'Task 1',
          description: 'Description 1',
          completed: false,
          userId: 'user1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          title: 'Task 2',
          description: 'Description 2',
          completed: true,
          userId: 'user2',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockTaskRepository.findAll.mockResolvedValue(tasks);

      const result = await taskService.getTasks();

      expect(mockTaskRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(tasks);
    });
  });
});
