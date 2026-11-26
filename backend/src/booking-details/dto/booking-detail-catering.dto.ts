import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, Min } from 'class-validator';

export class AddBookingDetailCateringDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  catering_id: number;

  @ApiProperty({ example: 10 })
  @IsInt()
  @Min(1)
  quantity: number;
}
