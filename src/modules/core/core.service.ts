import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../database/entities/user.entity';
import { Booking } from '../../database/entities/booking.entity';
import { Connection, EntityManager, QueryFailedError, Repository } from 'typeorm';
import { WaitingList } from '../../database/entities/waiting-list.entity';
import { CreateBookingDto } from './dtos/create-booking.dto';
import { Event } from '../../database/entities/event.entity';
import { BookingStatus } from '../../enums/booking-status.enum';
import { CancelBookingDto } from './dtos/cancel-booking.dto';


@Injectable()
export class CoreService {

    constructor(@InjectRepository(Booking) private readonly bookingRepository: Repository<Booking>,
                @InjectRepository(WaitingList) private readonly waitingListRepository: Repository<WaitingList>,
                private connection: Connection,){}

    async bookEventTicket(createBookingDto: CreateBookingDto) : Promise<any> {
        const { userId , eventId } = createBookingDto

        return await this.connection.transaction(async manager=> {
        let retry = 3

        while( retry > 0 ) {
            try{
            const event = await this.findEventById(eventId, manager)

            // check if tickets is available
            if(event.availableTickets>0){

            return this.bookAvailableTicket(manager, userId, event)
                
            }else {
            //add to the waiting list if tickets is sold out

                    return this.addToWaitingList(manager, userId, event)
            }
            }catch(error) {

            if (this.isOptimisticLockException(error)) {

            retry--;
                if (retry === 0) throw new HttpException('Could not book the ticket due to concurrent updates. Please try again.', HttpStatus.CONFLICT);
            } else {
            throw error;
                }
            }
            }
        });
    }

    async cancelBooking(cancelBookingDto: CancelBookingDto): Promise<any> {
        const { userId, bookingId } = cancelBookingDto;
        return await this.connection.transaction(async manager => {
          const booking = await this.findBookingById(bookingId, userId, manager);
          const event = booking.event;
    
          booking.status = BookingStatus.CANCELLED;

          //save cancelled tickets
          await manager.save(booking);
    
          return await this.handleCancellationAndReassignment(manager, event);
        });
        
      }
    

     //private methods for modularity and clearity
    private async bookAvailableTicket(manager, userId: string, event: Event) {
        event.availableTickets--;

        // Optimistic lock check happens here
        await manager.save(event); 
    
        const booking = this.bookingRepository.create({
          user: { id: userId } as User,
          event: { id: event.id } as Event,
          status: BookingStatus.BOOKED,
        });
    
        await manager.save(booking);
        return { message: 'Ticket booked successfully', booking };
      }
    
      private async addToWaitingList(manager, userId: string, event: Event) {

        const waitingList = this.waitingListRepository.create({
        user: { id: userId } as User,
        event: { id: event.id } as Event,
        position: await this.getNextWaitingListPosition(event.id),
        });
    
        await manager.save(waitingList);
        return { message: 'No tickets available, added to the waiting list', waitingList };
      }

      private async handleCancellationAndReassignment(manager, event: Event) {

        // Increment the available tickets
        event.availableTickets++;
        await manager.save(event);
    
        const nextWaitingUser = await manager.findOne(WaitingList, {
          where: { event: { id: event.id } as Event},
          relations: ['user'],
          order: { position: 'ASC' },
        });
  
        if (nextWaitingUser) {
        await manager.remove(nextWaitingUser);
    
        const newBooking = this.bookingRepository.create({
        user: { id: nextWaitingUser.user.id } as User,
        event: { id: event.id } as Event,
        status: BookingStatus.BOOKED,
        });

        //save the new booking
        await manager.save(newBooking);

        //decreased available tickets since it has been re-assigned
        event.availableTickets--;
        await manager.save(event);

        return {
        message: `Booking cancelled. Ticket assigned to waiting list user: ${nextWaitingUser.user.id}`,
        newBooking,
        };
        }
    
        return { message: 'Booking cancelled successfully' };
      }
    
      private async findEventById(eventId: string, manager): Promise<Event> {
        const event = await manager.findOne(Event, {
            where: { id: eventId }  
        });
        if (!event) throw new NotFoundException('Event not found');
        return event;
    }

      private async findBookingById(bookingId: string, userId: string, manager: EntityManager): Promise<Booking> {
        const booking = await manager.findOne(Booking, {
        where: { id: bookingId, user: { id: userId }, status: BookingStatus.BOOKED },
        relations: ['event'],
      });
       if (!booking) throw new NotFoundException('Booking not found or already cancelled');
       return booking;
  }
    
     
      private async getNextWaitingListPosition(eventId: string): Promise<number> {
        const lastInWaitingList = await this.waitingListRepository.findOne({
        where: { event: { id: eventId } },
        order: { position: 'DESC' },
        });
        return lastInWaitingList ? lastInWaitingList.position + 1 : 1;
      }

    private isOptimisticLockException(error: any): boolean {
       return error instanceof QueryFailedError && error.message.includes('OptimisticLockException');
      }
    
}
