import { Test, TestingModule } from '@nestjs/testing';
import { CoreService } from './core.service';
import { Booking } from '../../database/entities/booking.entity';
import { WaitingList } from '../../database/entities/waiting-list.entity';
import { Connection, QueryFailedError } from 'typeorm';
import { CreateBookingDto } from './dtos/create-booking.dto';
import { CancelBookingDto } from './dtos/cancel-booking.dto';
import { NotFoundException } from '@nestjs/common';
import { BookingStatus } from '../../enums/booking-status.enum';
import { Event } from '../../database/entities/event.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('CoreService', () => {
  let service: CoreService;
  let connection: Connection;

  const mockBookingRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const mockWaitingListRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockEventRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const mockConnection = {
    transaction: jest.fn((cb) => cb(mockEntityManager)),
  };

  const mockEntityManager = {
    findOne: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoreService,
        { provide: getRepositoryToken(Booking), useValue: mockBookingRepository },
        { provide: getRepositoryToken(WaitingList), useValue: mockWaitingListRepository },
        { provide: getRepositoryToken(Event), useValue: mockEventRepository },
        { provide: Connection, useValue: mockConnection },
      ],
    }).compile();

    service = module.get<CoreService>(CoreService);
    connection = module.get<Connection>(Connection);
  });

  describe('bookEventTicket', () => {
    it('should fail to book a ticket if event is not found', async () => {
      const createBookingDto: CreateBookingDto = {
        userId: 'user-1',
        eventId: 'event-1',
        status: BookingStatus.BOOKED,
      };

      mockEntityManager.findOne.mockResolvedValueOnce(null); 

      await expect(service.bookEventTicket(createBookingDto)).rejects.toThrow(NotFoundException);
    });

    it('should add the user to the waiting list if there are no available tickets', async () => {
      const createBookingDto: CreateBookingDto = {
        userId: 'user-1',
        eventId: 'event-1',
        status: BookingStatus.BOOKED,
      };
    
      const mockEvent = { id: 'event-1', availableTickets: 0 };
    
      mockEntityManager.findOne.mockResolvedValueOnce(mockEvent);
      mockWaitingListRepository.create.mockReturnValue({});
      mockWaitingListRepository.save.mockResolvedValue({}); // Ensure the save is resolved properly
    
      const result = await service.bookEventTicket(createBookingDto);
    
      expect(result).toEqual({
        message: 'No tickets available, added to the waiting list',
        waitingList: {},
      });
    
      // Check that the waiting list entry was created with userId and eventId
      expect(mockWaitingListRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          user: { id: createBookingDto.userId },
          event: { id: createBookingDto.eventId },
          position: expect.any(Number), 
        })
      );
    });
    
    it('should successfully book a ticket if available', async () => {
      const createBookingDto: CreateBookingDto = {
          userId: 'user-1',
          eventId: 'event-1',
          status: BookingStatus.BOOKED,
      };
  
      const mockEvent = { id: 'event-1', availableTickets: 10 };
      const mockBooking = { id: 'booking-1', userId: 'user-1', eventId: 'event-1' };
  
      mockEntityManager.findOne.mockResolvedValueOnce(mockEvent);
      mockBookingRepository.create.mockReturnValue(mockBooking);
      mockBookingRepository.save.mockResolvedValue(mockBooking);
  
      // Mocking manager.save for both event and booking
      mockEntityManager.save = jest.fn().mockResolvedValueOnce(mockEvent).mockResolvedValueOnce(mockBooking);
  
      const result = await service.bookEventTicket(createBookingDto);
  
      expect(result).toEqual({
          message: 'Ticket booked successfully',
          booking: mockBooking,
      });
      expect(mockBookingRepository.create).toHaveBeenCalledWith(expect.objectContaining({
          user: { id: createBookingDto.userId },
          event: { id: createBookingDto.eventId },
          status: createBookingDto.status,
      }));
      expect(mockEntityManager.save).toHaveBeenCalledTimes(2); // Check that save was called twice
      expect(mockEntityManager.save).toHaveBeenCalledWith(expect.objectContaining({
          id: 'event-1',
          availableTickets: 9,
      }));
  });
  
    it('should fail when optimistic lock exception occurs', async () => {
      const createBookingDto: CreateBookingDto = {
        userId: 'user-1',
        eventId: 'event-1',
        status: BookingStatus.BOOKED,
      };

      const mockEvent = { id: 'event-1', availableTickets: 1 };

      mockEntityManager.findOne.mockResolvedValueOnce(mockEvent);
      mockEntityManager.save.mockImplementationOnce(() => {
        throw new QueryFailedError('Error', [], 'OptimisticLockException' as any);
      });

      await expect(service.bookEventTicket(createBookingDto)).rejects.toThrow(QueryFailedError);
    });
  });

  describe('cancelBooking', () => {
    it('should fail to cancel a booking if booking is not found', async () => {
      const cancelBookingDto: CancelBookingDto = {
        userId: 'user-1',
        bookingId: 'booking-1',
      };

      mockEntityManager.findOne.mockResolvedValueOnce(null);

      await expect(service.cancelBooking(cancelBookingDto)).rejects.toThrow(NotFoundException);
    });

    it('should fail if there is an error during cancellation', async () => {
      const cancelBookingDto: CancelBookingDto = {
        userId: 'user-1',
        bookingId: 'booking-1',
      };

      const mockBooking = { id: 'booking-1', event: {} };

      mockEntityManager.findOne.mockResolvedValueOnce(mockBooking);
      mockEntityManager.save.mockRejectedValueOnce(new Error('Database error'));

      await expect(service.cancelBooking(cancelBookingDto)).rejects.toThrow(Error);
    });

    it('should successfully cancel a booking', async () => {
      const cancelBookingDto: CancelBookingDto = {
          userId: 'user-1',
          bookingId: 'booking-1',
      };
  
      const mockBooking = {
          id: 'booking-1',
          event: { id: 'event-1', availableTickets: 5 },
          status: BookingStatus.BOOKED,
      };
  
      const mockUpdatedEvent = { id: 'event-1', availableTickets: 6 };
  

      mockEntityManager.findOne.mockResolvedValueOnce(mockBooking);
      mockEntityManager.save.mockResolvedValueOnce(mockBooking);
      mockEventRepository.save.mockResolvedValueOnce(mockUpdatedEvent);
  
      const result = await service.cancelBooking(cancelBookingDto);
  
      expect(result).toEqual({ message: 'Booking cancelled successfully' });
      expect(mockEntityManager.save).toHaveBeenCalledWith(mockBooking);
  });
  })  
})
