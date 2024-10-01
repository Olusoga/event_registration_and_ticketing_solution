import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { CoreService } from './core.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CancelBookingDto } from './dtos/cancel-booking.dto';
import { CreateBookingDto } from './dtos/create-booking.dto';
import { Throttle } from '@nestjs/throttler';

@ApiTags('Core')
@Controller('booking')
export class CoreController {
  constructor(private readonly coreService: CoreService) {}

  @Post('book')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({
    summary: 'Book a ticket for an event or add to waiting list if sold out',
  })
  @ApiResponse({
    status: 200,
    description: 'Ticket booked successfully or added to waiting list.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async bookTicket(@Body() bookTicketDto: CreateBookingDto): Promise<any> {
    try {
      const result = await this.coreService.bookEventTicket(bookTicketDto);
      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('cancel')
  @ApiOperation({
    summary: 'Cancel a booking and reassign the ticket to waiting list users',
  })
  @ApiResponse({
    status: 200,
    description: 'Booking canceled successfully and reassigned.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async cancelBooking(
    @Body() cancelBookingDto: CancelBookingDto,
  ): Promise<any> {
    try {
      const result = await this.coreService.cancelBooking(cancelBookingDto);
      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
