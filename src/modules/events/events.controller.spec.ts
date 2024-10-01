import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { CreateEventDto } from './dtos/create-event.dto';
import { EventStatusDto } from './dtos/create-event-status.dto';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';

describe('EventsController', () => {
  let controller: EventsController;
  let service: EventsService;

  const mockEventService = {
    create: jest.fn(),
    getEventStatus: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [
        {
          provide: EventsService,
          useValue: mockEventService,
        },
      ],
    }).compile();

    controller = module.get<EventsController>(EventsController);
    service = module.get<EventsService>(EventsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createEvent', () => {
    it('should successfully create an event', async () => {
      const createEventDto: CreateEventDto = {
        name: 'Test Event',
        availableTickets: 100,
      };

      const mockCreatedEvent = {
        id: 'event-1',
        ...createEventDto,
      };

      mockEventService.create.mockResolvedValue(mockCreatedEvent);

      const result = await controller.createEvent(createEventDto);

      expect(result).toEqual(mockCreatedEvent);
      expect(service.create).toHaveBeenCalledWith(createEventDto);
    });

    it('should throw InternalServerErrorException if event creation fails', async () => {
      const createEventDto: CreateEventDto = {
        name: 'Test Event',
        availableTickets: 100,
      };

      mockEventService.create.mockRejectedValue(
        new InternalServerErrorException(),
      );

      await expect(controller.createEvent(createEventDto)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(service.create).toHaveBeenCalledWith(createEventDto);
    });
  });

  describe('getEventStatus', () => {
    it('should return event status successfully', async () => {
      const eventId = 'event-1';

      const mockEventStatus: EventStatusDto = {
        availableTickets: 10,
        waitingList: 3,
      };

      mockEventService.getEventStatus.mockResolvedValue(mockEventStatus);

      const result = await controller.getEventStatus(eventId);

      expect(result).toEqual(mockEventStatus);
      expect(service.getEventStatus).toHaveBeenCalledWith(eventId);
    });

    it('should throw NotFoundException if the event is not found', async () => {
      const eventId = 'invalid-event-id';

      mockEventService.getEventStatus.mockRejectedValue(
        new NotFoundException(),
      );

      await expect(controller.getEventStatus(eventId)).rejects.toThrow(
        NotFoundException,
      );

      expect(service.getEventStatus).toHaveBeenCalledWith(eventId);
    });

    it('should throw InternalServerErrorException for unexpected errors', async () => {
      const eventId = 'event-1';

      mockEventService.getEventStatus.mockRejectedValue(
        new InternalServerErrorException(),
      );

      await expect(controller.getEventStatus(eventId)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(service.getEventStatus).toHaveBeenCalledWith(eventId);
    });
  });
});
