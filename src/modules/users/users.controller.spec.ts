import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from '../../database/entities/user.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let usersService: UsersService;

  const mockUserService = {
    create: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/users (POST)', () => {
    it('should create a user successfully (positive test)', async () => {
      const createUserDto: CreateUserDto = {
        // fill in with required properties
        name: 'testuser',
        email: 'testuser@example.com',
      };

      const expectedUser: User = {
        id: '1', ...createUserDto,
        createdAt: undefined,
        updatedAt: undefined,
        bookings: [],
        waitingList: []
      }; 
      mockUserService.create.mockResolvedValue(expectedUser);

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(HttpStatus.CREATED);

      expect(response.body).toEqual(expectedUser);
      expect(mockUserService.create).toHaveBeenCalledWith(createUserDto);
    });

    it('should return an error if user data is invalid (negative test)', async () => {
      const createUserDto: CreateUserDto = {
        name: '', 
        email: 'invalid-email', 
      };

      mockUserService.create.mockImplementation(() => {
        throw new HttpException('Invalid user data', HttpStatus.BAD_REQUEST);
      });

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body).toEqual({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Invalid user data',
      });
      expect(mockUserService.create).toHaveBeenCalledWith(createUserDto);
    });
  });
});
