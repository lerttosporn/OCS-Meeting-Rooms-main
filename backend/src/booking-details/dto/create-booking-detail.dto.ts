import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsPositive, IsString, IsDateString, IsNumber, IsOptional, Min, IsEnum } from 'class-validator';

export enum TrainingFormat {
  ON_SITE = 'ON_SITE',
  HYBRID = 'HYBRID',
}

export class CreateBookingDetailDto {
  @ApiProperty({ example: 1, description: 'ID ของ Booking หลัก' })
  @IsInt()
  @IsPositive()
  booking_id: number;

  @ApiProperty({ example: 1, description: 'ID ของห้อง' })
  @IsInt()
  @IsPositive()
  room_id: number;

  @ApiPropertyOptional({ example: 'ประชุมวางแผนประจำปี', description: 'หัวข้อการจอง' })
  @IsString()
  @IsOptional()
  topic?: string;

  @ApiProperty({ example: '2023-10-10' })
  @IsDateString()
  start_date: string;

  @ApiProperty({ example: '2023-10-10' })
  @IsDateString()
  end_date: string;

  @ApiProperty({ example: '10:00:00' })
  @IsString()
  start_time: string;

  @ApiProperty({ example: '12:00:00' })
  @IsString()
  end_time: string;

  @ApiProperty({ example: 1500.00, description: 'ราคาที่ถูกบันทึก ณ เวลานั้น' })
  @IsNumber()
  @Min(0)
  price_snapshot: number;

  @ApiPropertyOptional({ example: 'กท-1234' })
  @IsString()
  @IsOptional()
  car_plate1?: string;

  @ApiPropertyOptional({ example: 'ขข-9999' })
  @IsString()
  @IsOptional()
  car_plate2?: string;

  @ApiPropertyOptional({ example: 0 })
  @IsNumber()
  @IsOptional()
  overtime_fee?: number;

  @ApiPropertyOptional({ example: 0 })
  @IsNumber()
  @IsOptional()
  external_catering?: number;

  @ApiProperty({
    enum: TrainingFormat,
    example: TrainingFormat.ON_SITE,
    description: 'รูปแบบการจัดอบรม: ON_SITE = บรรยาย/ปฏิบัติการในห้อง, HYBRID = ใช้ระบบออนไลน์ด้วย (WebEx/Zoom)',
    default: TrainingFormat.ON_SITE,
  })
  @IsEnum(TrainingFormat)
  @IsOptional()
  training_format?: TrainingFormat;
}
