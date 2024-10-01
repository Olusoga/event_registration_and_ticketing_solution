import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EventStatusDto {
  @ApiProperty({
    description: 'Number of available tickets for the event',
    example: 10,
  })
  @IsNumber()
  availableTickets: number;

  @ApiProperty({
    description: 'Number of users on the waiting list for the event',
    example: 5,
  })
  @IsNumber()
  waitingList: number;
}
