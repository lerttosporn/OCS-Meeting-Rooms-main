import { PartialType } from '@nestjs/swagger';
import { CreateRoomRateDto } from './create-room-rate.dto';

export class UpdateRoomRateDto extends PartialType(CreateRoomRateDto) {}
