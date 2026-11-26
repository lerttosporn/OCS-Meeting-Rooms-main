import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsPositive, IsNumber, Min, IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class AddBookingDetailToolDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @IsPositive()
  tool_id?: number;

  @ApiPropertyOptional({ example: '3D Printer' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  custom_name?: string;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({ example: 500.00 })
  @IsNumber()
  @Min(0)
  price_snapshot: number;
}
