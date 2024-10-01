import { IsUUID, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CancelBookingDto {
  @ApiProperty({
    description: 'The ID of the user who is canceling the booking',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'The ID of the booking to cancel',
    example: '8c92344c-4d2e-4e73-9c1a-9adbb3f42388',
  })
  @IsUUID()
  @IsNotEmpty()
  bookingId: string;
}
