import { UserService } from '../../../application/services/user.service';
import { UserRepository } from '../../../domain/repositories';
import { User } from '../../../domain/entities';

describe('UserService', () => {
  let userService: UserService;
  let mockUserRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockUserRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    userService = new UserService(mockUserRepository);
  });

  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      const userData = { email: 'test@example.com' };
      const createdUser: User = {
        id: '1',
        email: 'test@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.create.mockResolvedValue(createdUser);

      const result = await userService.createUser(userData);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(mockUserRepository.create).toHaveBeenCalledWith(userData);
      expect(result).toEqual(createdUser);
    });

    it('should throw error if user already exists', async () => {
      const userData = { email: 'test@example.com' };
      const existingUser: User = {
        id: '1',
        email: 'test@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserRepository.findByEmail.mockResolvedValue(existingUser);

      await expect(userService.createUser(userData)).rejects.toThrow(
        'User with this email already exists'
      );
    });
  });

  describe('getUserByEmail', () => {
    it('should return user if found', async () => {
      const userData = { email: 'test@example.com' };
      const user: User = {
        id: '1',
        email: 'test@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserRepository.findByEmail.mockResolvedValue(user);

      const result = await userService.getUserByEmail(userData);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(result).toEqual(user);
    });

    it('should return null if user not found', async () => {
      const userData = { email: 'test@example.com' };

      mockUserRepository.findByEmail.mockResolvedValue(null);

      const result = await userService.getUserByEmail(userData);

      expect(result).toBeNull();
    });
  });
});
