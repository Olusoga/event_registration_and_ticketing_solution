import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, Min } from 'class-validator';

export class CreateEventDto {
  @ApiProperty({
    description: 'The name of the event',
    example: 'Music Concert',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The number of available tickets for the event',
    example: 100,
  })
  @IsInt()
  @Min(1)
  availableTickets: number;
}
