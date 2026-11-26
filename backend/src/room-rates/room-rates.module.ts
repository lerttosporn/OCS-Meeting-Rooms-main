import { Module } from '@nestjs/common';
import { RoomRatesController } from './room-rates.controller';
import { RoomRatesService } from './room-rates.service';

@Module({
  controllers: [RoomRatesController],
  providers: [RoomRatesService]
})
export class RoomRatesModule {}
