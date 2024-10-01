import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from '../../database/entities/event.entity';
import { WaitingList } from '../../database/entities/waiting-list.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event, WaitingList])],
  providers: [EventsService],
  controllers: [EventsController],
})
export class EventsModule {}
