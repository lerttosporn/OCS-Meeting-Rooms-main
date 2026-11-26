import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsPositive, IsString, IsNumber, IsNotEmpty, IsOptional, Min } from 'class-validator';

export class CreateBookingPenaltyDto {
  @ApiProperty({ example: 1, description: 'ID ของ Booking Detail' })
  @IsInt()
  @IsPositive()
  booking_detail_id: number;

  @ApiPropertyOptional({ example: 1, description: 'ID ของอุปกรณ์ที่เสียหาย (ถ้ามี)' })
  @IsInt()
  @IsPositive()
  @IsOptional()
  tool_id?: number;

  @ApiProperty({ example: 'ทำแก้วแตก', description: 'รายละเอียดค่าปรับ' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 1, description: 'จำนวน' })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({ example: 500.00, description: 'รวมเป็นเงิน' })
  @IsNumber()
  @Min(0)
  total_amount: number;
}
