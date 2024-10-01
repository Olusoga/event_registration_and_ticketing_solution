import { IsEnum, IsUUID, IsNotEmpty } from 'class-validator';
import { BookingStatus } from '../../../enums/booking-status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({
    description: 'The ID of the user who is booking the ticket',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'The ID of the event for which the ticket is being booked',
    example: '1d7b7bc4-63bb-4f84-8ed7-4f16fc0ebd51',
  })
  @IsUUID()
  @IsNotEmpty()
  eventId: string;

  @ApiProperty({
    description: 'The status of the booking (e.g., BOOKED, CANCELLED)',
    example: BookingStatus.BOOKED,
    enum: BookingStatus,
  })
  @IsEnum(BookingStatus)
  @IsNotEmpty()
  status: BookingStatus;
}
