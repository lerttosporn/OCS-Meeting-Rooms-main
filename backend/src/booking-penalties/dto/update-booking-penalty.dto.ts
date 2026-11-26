import { PartialType } from '@nestjs/swagger';
import { CreateBookingPenaltyDto } from './create-booking-penalty.dto';

export class UpdateBookingPenaltyDto extends PartialType(CreateBookingPenaltyDto) {}
