import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsPositive, IsOptional, IsString } from 'class-validator';

export class CreateCartItemDto {
  @ApiProperty({ example: 1, description: 'ID ของห้อง' })
  @IsInt()
  @IsPositive()
  room_id: number;

  @ApiProperty({ example: 1, description: 'ID ของเรทราคา' })
  @IsInt()
  @IsPositive()
  room_rate_id: number;

  @ApiPropertyOptional({ example: 1, description: 'จำนวน' })
  @IsInt()
  @IsPositive()
  @IsOptional()
  quantity?: number;

  @ApiPropertyOptional({ example: '10:00:00', description: 'เวลาเริ่ม' })
  @IsString()
  @IsOptional()
  start_time?: string;

  @ApiPropertyOptional({ example: '12:00:00', description: 'เวลาสิ้นสุด' })
  @IsString()
  @IsOptional()
  end_time?: string;
}
