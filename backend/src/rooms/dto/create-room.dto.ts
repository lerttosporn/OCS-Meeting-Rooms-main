import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString, IsNotEmpty, IsOptional, IsEnum,
  IsInt, IsPositive, MaxLength,
} from 'class-validator';

export enum RoomStatus {
  AVAILABLE = 'available',
  MAINTENANCE = 'maintenance',
  RESERVED = 'reserved',
}

export class CreateRoomDto {
  @ApiProperty({ example: 1, description: 'org_id' })
  @IsInt()
  @IsPositive()
  org_id: number;

  @ApiProperty({ example: 1, description: 'room_type_id' })
  @IsInt()
  @IsPositive()
  room_type_id: number;

  @ApiProperty({ example: 'ห้องประชุม A101', description: 'ชื่อห้อง' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  room_name: string;

  @ApiProperty({ example: 20, description: 'ความจุ (คน)' })
  @IsInt()
  @IsPositive()
  capacity: number;

  @ApiProperty({ example: 3, description: 'ชั้นที่ตั้งห้อง' })
  @IsInt()
  @IsPositive()
  floor: number;

  @ApiProperty({ enum: RoomStatus, example: RoomStatus.AVAILABLE })
  @IsEnum(RoomStatus)
  room_status: RoomStatus;
}
