import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, IsString, IsNumber, Min } from 'class-validator';

export class CreateRoomRateDto {
  @ApiProperty({ example: 1, description: 'ID ของห้อง' })
  @IsInt()
  @IsPositive()
  room_id: number;

  @ApiProperty({ example: 'เช้า (Morning)', description: 'ชื่อเรทราคา' })
  @IsString()
  rate_name: string;

  @ApiProperty({ example: '08:00:00', description: 'เวลาเริ่ม' })
  @IsString()
  start_time: string;

  @ApiProperty({ example: '12:00:00', description: 'เวลาสิ้นสุด' })
  @IsString()
  end_time: string;

  @ApiProperty({ example: 500.00, description: 'ราคา' })
  @IsNumber()
  @Min(0)
  price: number;
}
