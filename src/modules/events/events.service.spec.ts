import { NotFoundException, InternalServerErrorException } from "@nestjs/common";
import { TestingModule, Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Event } from "../../database/entities/event.entity";  // Add this import
import { WaitingList } from "../../database/entities/waiting-list.entity";
import { EventsService } from "./events.service";
import { CreateEventDto } from "./dtos/create-event.dto";

describe('EventsService', () => {
    let service: EventsService; 
    let mockEventRepository: any;
    let mockWaitingListRepository: any;
  
    beforeEach(async () => {
      mockEventRepository = {
        findOne: jest.fn(),
        create: jest.fn(),  
        save: jest.fn(),   
      };
  
      mockWaitingListRepository = {
        count: jest.fn(),
      };
  
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          EventsService, 
          { provide: getRepositoryToken(Event), useValue: mockEventRepository },
          { provide: getRepositoryToken(WaitingList), useValue: mockWaitingListRepository },
        ],
      }).compile();
  
      service = module.get<EventsService>(EventsService); 
    });
  
    describe('create', () => {
        it('should successfully create an event', async () => {
          const createEventDto: CreateEventDto = { name: 'Test Event', availableTickets: 100 }; 
    
          const mockEvent = { id: 'event-1', name: 'Test Event', availableTickets: 100 };
    
          
          mockEventRepository.create.mockReturnValue(mockEvent);
          mockEventRepository.save.mockResolvedValue(mockEvent);
    
          
          const result = await service.create(createEventDto);
    
         
          expect(result).toEqual(mockEvent);
          expect(mockEventRepository.create).toHaveBeenCalledWith(createEventDto);
          expect(mockEventRepository.save).toHaveBeenCalledWith(mockEvent);
        });
    
        it('should throw an InternalServerErrorException if saving fails', async () => {
          const createEventDto: CreateEventDto = { name: 'Test Event', availableTickets: 100 };
    
          mockEventRepository.create.mockReturnValue(createEventDto);
          mockEventRepository.save.mockRejectedValue(new Error('Database error'));
    
          await expect(service.create(createEventDto)).rejects.toThrow(InternalServerErrorException);
        });
      });
      
    describe('getEventStatus', () => {
      it('should return event status successfully when event exists', async () => {
        const mockEvent = {
          id: 'event-1',
          availableTickets: 10,
        };
  
        mockEventRepository.findOne.mockResolvedValueOnce(mockEvent);
        mockWaitingListRepository.count.mockResolvedValueOnce(3);
  
        const result = await service.getEventStatus('event-1');
  
        expect(result).toEqual({
          availableTickets: 10,
          waitingList: 3,
        });
  
        expect(mockEventRepository.findOne).toHaveBeenCalledWith({
          where: { id: 'event-1' },
        });
        expect(mockWaitingListRepository.count).toHaveBeenCalledWith({
          where: { event: { id: 'event-1' } },
        });
      });
  
      it('should throw NotFoundException if event is not found', async () => {
        mockEventRepository.findOne.mockResolvedValueOnce(null);
  
        await expect(service.getEventStatus('invalid-event-id')).rejects.toThrow(
          NotFoundException,
        );
  
        expect(mockEventRepository.findOne).toHaveBeenCalledWith({
          where: { id: 'invalid-event-id' },
        });
        expect(mockWaitingListRepository.count).not.toHaveBeenCalled();
      });
  
      it('should throw InternalServerErrorException for any other errors', async () => {
        mockEventRepository.findOne.mockRejectedValueOnce(new Error('Database error'));
  
        await expect(service.getEventStatus('event-1')).rejects.toThrow(
          InternalServerErrorException,
        );
  
        expect(mockEventRepository.findOne).toHaveBeenCalledWith({
          where: { id: 'event-1' },
        });
        expect(mockWaitingListRepository.count).not.toHaveBeenCalled();
      });
    });
  });
