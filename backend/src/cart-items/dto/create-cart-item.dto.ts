import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsPositive, IsOptional, IsString } from 'class-validator';

export class CreateCartItemDto {
  @ApiProperty({ example: 1, description: 'ID ของตระกร้า' })
  @IsInt()
  @IsPositive()
  cart_id: number;

  @ApiProperty({ example: 1, description: 'ID ของห้อง' })
  @IsInt()
  @IsPositive()
  room_id: number;

  @ApiProperty({ example: 1, description: 'ID ของเรทราคา' })
  @IsInt()
  @IsPositive()
  room_rate_id: number;

  @ApiProperty({ example: '2025-06-01', description: 'วันที่เริ่ม' })
  @IsString()
  start_date: string;

  @ApiProperty({ example: '2025-06-01', description: 'วันที่สิ้นสุด' })
  @IsString()
  end_date: string;

  @ApiPropertyOptional({ example: '10:00:00', description: 'เวลาเริ่ม' })
  @IsString()
  @IsOptional()
  start_time?: string;

  @ApiPropertyOptional({ example: '12:00:00', description: 'เวลาสิ้นสุด' })
  @IsString()
  @IsOptional()
  end_time?: string;
}
