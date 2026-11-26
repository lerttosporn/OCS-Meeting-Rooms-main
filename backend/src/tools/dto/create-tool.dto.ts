import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsInt, Min, IsOptional } from 'class-validator';

export class CreateToolDto {
  @ApiProperty({ example: 'Projector', description: 'ชื่ออุปกรณ์' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'รายละเอียดอุปกรณ์', description: 'รายละเอียด' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 500.00, description: 'ราคาต่อหน่วย' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  unit_price?: number;

  @ApiPropertyOptional({ example: 10, description: 'จำนวนในสต็อก' })
  @IsInt()
  @Min(0)
  @IsOptional()
  stock?: number;
}
