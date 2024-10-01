import { IsUUID, IsNotEmpty } from 'class-validator';

export class CreateWaitingListDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsUUID()
  @IsNotEmpty()
  eventId: string;
}
