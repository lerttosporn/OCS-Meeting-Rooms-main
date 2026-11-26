import { Module } from '@nestjs/common';
import { BookingPenaltiesController } from './booking-penalties.controller';
import { BookingPenaltiesService } from './booking-penalties.service';

@Module({
  controllers: [BookingPenaltiesController],
  providers: [BookingPenaltiesService]
})
export class BookingPenaltiesModule {}
