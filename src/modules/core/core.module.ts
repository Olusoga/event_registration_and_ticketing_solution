import { Module } from '@nestjs/common';
import { CoreService } from './core.service';
import { CoreController } from './core.controller';
import { Booking } from '../../database/entities/booking.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WaitingList } from '../../database/entities/waiting-list.entity';
import { User } from '../../database/entities/user.entity';
import { UsersService } from '../users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, WaitingList, User])],
  providers: [CoreService, UsersService],
  controllers: [CoreController],
})
export class CoreModule {}
