import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from '../../database/entities/event.entity';
import { Repository } from 'typeorm';
import { CreateEventDto } from './dtos/create-event.dto';
import { EventStatusDto } from './dtos/create-event-status.dto';
import { WaitingList } from '../../database/entities/waiting-list.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(WaitingList)
    private readonly waitingListRepository: Repository<WaitingList>
  ) {}

  async create(createEventDto: CreateEventDto): Promise<Event> {
    try {
      const event = this.eventRepository.create(createEventDto);
      return await this.eventRepository.save(event);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create event');
    }
  }
  

  async getEventStatus(eventId: string): Promise<EventStatusDto> {
    try {
        
        const event = await this.eventRepository.findOne({
            where: { id: eventId },
        });

        if (!event) throw new NotFoundException('Event not found');

        const waitingList = await this.waitingListRepository.count({
            where: { event: { id: event.id } },
        });

        return {
            availableTickets: event.availableTickets,
            waitingList,
        };
    } catch (error) {
        if (error instanceof NotFoundException) {
            throw error; 
        } else {
            
            throw new InternalServerErrorException('An error occurred while fetching event status');
        }
    }
}
}
