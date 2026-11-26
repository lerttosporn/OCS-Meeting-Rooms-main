import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsPositive, IsString, IsOptional, Min } from 'class-validator';

export class AddBookingNetworkDto {
  @ApiProperty({ example: 5 })
  @IsInt()
  @Min(0)
  account_quantity: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  package_id: number;

  @ApiPropertyOptional({ example: 'https://meeting.example.com' })
  @IsString()
  @IsOptional()
  url?: string;

  @ApiPropertyOptional({ example: '8080' })
  @IsString()
  @IsOptional()
  port?: string;

  @ApiPropertyOptional({ example: 'delivery@example.com' })
  @IsString()
  @IsOptional()
  delivery_email?: string;
}
