import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateRoomTypeDto {
  @ApiProperty({ example: 'ห้องประชุมเล็ก', description: 'ชื่อประเภทห้อง' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ example: 'ห้องประชุมสำหรับ 5-10 คน' })
  @IsString()
  @IsOptional()
  description?: string;
}
