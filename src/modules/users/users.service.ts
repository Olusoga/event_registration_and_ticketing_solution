import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../database/entities/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {

    try{
        // const existingUser = await this.userRepository.findOne({ where: { email: createUserDto.email } });
        // if (existingUser) {
        //   throw new Error('User with this email already exists');
        // }
        const user = this.userRepository.create(createUserDto);
        return await this.userRepository.save(user);
    }catch (error) {
        throw new InternalServerErrorException('Failed to create user');
      }
  }
}
