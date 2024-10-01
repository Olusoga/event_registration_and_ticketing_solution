import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../database/entities/user.entity';
import { InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let mockUserRepository: Repository<User>;

  const mockUserRepositoryFactory = () => ({
    create: jest.fn() as jest.MockedFunction<() => User>, 
    save: jest.fn() as jest.MockedFunction<(entity: User) => Promise<User>>, 
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useFactory: mockUserRepositoryFactory,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    mockUserRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });
  

  afterEach(() => {
    jest.clearAllMocks(); 
  });

  describe('create', () => {
    it('should successfully create and return a user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'testuser',
        email: 'testuser@example.com',
      };

      const mockUser: User = {
        id: '1',
        name: 'testuser',
        email: 'testuser@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        bookings: [],
        waitingList: []
      };

      (mockUserRepository.create as jest.Mock).mockReturnValue(mockUser);
      (mockUserRepository.save as jest.Mock).mockResolvedValue(mockUser);


      const result = await service.create(createUserDto);

   
      expect(result).toEqual(mockUser);
      expect(mockUserRepository.create).toHaveBeenCalledWith(createUserDto);
      expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);
    });

    it('should throw InternalServerErrorException if saving fails', async () => {
      const createUserDto: CreateUserDto = {
        name: 'testuser',
        email: 'testuser@example.com',
      };

      (mockUserRepository.create as jest.Mock).mockReturnValue(createUserDto);
      (mockUserRepository.save as jest.Mock).mockRejectedValue(new Error('Database error'));

      await expect(service.create(createUserDto)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(mockUserRepository.create).toHaveBeenCalledWith(createUserDto);
      expect(mockUserRepository.save).toHaveBeenCalledWith(createUserDto);
    });
  });
});
