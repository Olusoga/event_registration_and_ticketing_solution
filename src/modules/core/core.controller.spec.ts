import { Test, TestingModule } from '@nestjs/testing';
import { CoreController } from './core.controller';
import { CoreService } from './core.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CreateBookingDto } from './dtos/create-booking.dto';
import { CancelBookingDto } from './dtos/cancel-booking.dto';
import { BookingStatus } from '../../enums/booking-status.enum';

describe('CoreController', () => {
  let controller: CoreController;
  let service: CoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoreController],
      providers: [
        {
          provide: CoreService,
          useValue: {
            bookEventTicket: jest.fn(),
            cancelBooking: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CoreController>(CoreController);
    service = module.get<CoreService>(CoreService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('bookTicket', () => {
    const createBookingDto: CreateBookingDto = {
      userId: 'user-1',
      eventId: 'event-1',
      status: BookingStatus.BOOKED,
    };

    it('should book a ticket successfully', async () => {
      // Mocking the service response
      const serviceResult = {
        message: 'Ticket booked successfully',
      };

      jest.spyOn(service, 'bookEventTicket').mockResolvedValue(serviceResult);

      const result = await controller.bookTicket(createBookingDto);

      expect(result).toEqual(serviceResult);
      expect(service.bookEventTicket).toHaveBeenCalledWith(createBookingDto);
    });

    it('should fail to book a ticket', async () => {
      // Mocking the service to throw an error
      const serviceError = new Error('No tickets available');

      jest.spyOn(service, 'bookEventTicket').mockRejectedValue(serviceError);

      try {
        await controller.bookTicket(createBookingDto);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toBe(HttpStatus.BAD_REQUEST);
        expect(error.message).toBe(serviceError.message);
      }
    });
  });

  describe('cancelBooking', () => {
    const cancelBookingDto: CancelBookingDto = {
      bookingId: 'booking-1',
      userId:"user-1"
    };

    it('should cancel a booking successfully', async () => {
      // Mocking the service response
      const serviceResult = {
        message: 'Booking canceled successfully',
      };

      jest.spyOn(service, 'cancelBooking').mockResolvedValue(serviceResult);

      const result = await controller.cancelBooking(cancelBookingDto);

      expect(result).toEqual(serviceResult);
      expect(service.cancelBooking).toHaveBeenCalledWith(cancelBookingDto);
    });

    it('should fail to cancel a booking', async () => {
      // Mocking the service to throw an error
      const serviceError = new Error('Booking not found');

      jest.spyOn(service, 'cancelBooking').mockRejectedValue(serviceError);

      try {
        await controller.cancelBooking(cancelBookingDto);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toBe(HttpStatus.BAD_REQUEST);
        expect(error.message).toBe(serviceError.message);
      }
    });
  });
});
