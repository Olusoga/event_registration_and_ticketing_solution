import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateEventDto } from './dtos/create-event.dto';
import { EventsService } from './events.service';
import { EventStatusDto } from './dtos/create-event-status.dto';
import { Throttle } from '@nestjs/throttler';

@ApiTags('event')
@Controller('events')
export class EventsController {
  constructor(private readonly eventService: EventsService) {}

  @Post()
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @ApiOperation({ summary: 'create event' })
  async createEvent(@Body() createEventDto: CreateEventDto) {
    return await this.eventService.create(createEventDto);
  }

  @Get('status/:eventId')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @ApiOperation({ summary: 'retrieve the current status of an event ' })
  async getEventStatus(@Param('eventId') eventId: string): Promise<EventStatusDto> {
    return this.eventService.getEventStatus(eventId);
  }
}
