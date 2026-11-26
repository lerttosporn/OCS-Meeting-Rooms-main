import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString, IsNotEmpty, IsOptional, IsEnum,
  IsInt, IsPositive, IsNumber, IsDateString, IsArray,
  ValidateNested, Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AddBookingNetworkDto } from '../../booking-details/dto/booking-network.dto';

export enum BookingStatus {
  DRAFT = 'draft',
  APPROVED = 'approved',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCEL = 'cancel',
}

export enum PaymentStatus {
  UNPAID = 'unpaid',
  PAID = 'paid',
  REFUNDED = 'refunded',
}

export enum TrainingFormat {
  ON_SITE = 'ON_SITE',
  HYBRID  = 'HYBRID',
}

export class BookingDetailToolDto {
  @ApiPropertyOptional({ example: 1, description: 'tool_id' })
  @IsOptional()
  @IsInt()
  @IsPositive()
  tool_id?: number;

  @ApiPropertyOptional({ example: '3D Printer', description: 'ชื่ออุปกรณ์ระบุอื่นๆ' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  custom_name?: string;

  @ApiProperty({ example: 2, description: 'จำนวน' })
  @IsInt()
  @IsPositive()
  quantity: number;

  @ApiProperty({ example: 500.00, description: 'ราคาต่อหน่วย ณ วันจอง' })
  @IsNumber()
  @Min(0)
  price_snapshot: number;
}

export class BookingDetailCateringDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  catering_id: number;

  @ApiProperty({ example: 50 })
  @IsInt()
  @IsPositive()
  quantity: number;
}

export class BookingDetailDto {
  @ApiProperty({ example: 1, description: 'room_id' })
  @IsInt()
  @IsPositive()
  room_id: number;

  @ApiPropertyOptional({ example: 'ประชุมทีม Q2' })
  @IsString()
  @IsOptional()
  topic?: string;

  @ApiProperty({ example: '2025-06-01', description: 'วันเริ่มต้น (YYYY-MM-DD)' })
  @IsDateString()
  start_date: string;

  @ApiProperty({ example: '2025-06-01', description: 'วันสิ้นสุด (YYYY-MM-DD)' })
  @IsDateString()
  end_date: string;

  @ApiProperty({ example: '09:00:00', description: 'เวลาเริ่ม (HH:MM:SS)' })
  @IsString()
  start_time: string;

  @ApiProperty({ example: '12:00:00', description: 'เวลาสิ้นสุด (HH:MM:SS)' })
  @IsString()
  end_time: string;

  @ApiProperty({ example: 1500.00, description: 'ราคา ณ วันจอง' })
  @IsNumber()
  @Min(0)
  price_snapshot: number;

  @ApiPropertyOptional({ example: 2000.00, description: 'ค่าปรับล่วงเวลา/วันหยุด' })
  @IsNumber()
  @IsOptional()
  @Min(0)
  overtime_fee?: number;

  @ApiPropertyOptional({ example: 'กท 1234' })
  @IsString()
  @IsOptional()
  car_plate1?: string;

  @ApiPropertyOptional({ example: 'ขย 9999' })
  @IsString()
  @IsOptional()
  car_plate2?: string;

  @ApiPropertyOptional({ type: [BookingDetailToolDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BookingDetailToolDto)
  @IsOptional()
  tools?: BookingDetailToolDto[];

  @ApiPropertyOptional({ type: [BookingDetailCateringDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BookingDetailCateringDto)
  @IsOptional()
  caterings?: BookingDetailCateringDto[];

  @ApiPropertyOptional({ type: [AddBookingNetworkDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddBookingNetworkDto)
  @IsOptional()
  networks?: AddBookingNetworkDto[];

  @ApiPropertyOptional({
    enum: TrainingFormat,
    example: TrainingFormat.ON_SITE,
    description: 'รูปแบบการจัดอบรม: ON_SITE = บรรยาย/ปฏิบัติการในห้อง, HYBRID = ใช้ระบบออนไลน์ด้วย (WebEx/Zoom)',
    default: TrainingFormat.ON_SITE,
  })
  @IsEnum(TrainingFormat)
  @IsOptional()
  training_format?: TrainingFormat;
}

export class CreateBookingDto {
  @ApiProperty({ example: 1, description: 'customer user id' })
  @IsInt()
  @IsPositive()
  customer_id: number;

  @ApiProperty({ example: 2, description: 'staff user id' })
  @IsInt()
  @IsPositive()
  staff_id: number;

  @ApiProperty({ example: 1500.00, description: 'ยอดรวม' })
  @IsNumber()
  @Min(0)
  total_amount: number;

  @ApiPropertyOptional({ example: 0, description: 'ส่วนลด' })
  @IsNumber()
  @IsOptional()
  @Min(0)
  discount_amount?: number;

  @ApiProperty({ enum: BookingStatus, example: BookingStatus.DRAFT })
  @IsEnum(BookingStatus)
  booking_status: BookingStatus;

  @ApiProperty({ enum: PaymentStatus, example: PaymentStatus.UNPAID })
  @IsEnum(PaymentStatus)
  payment_status: PaymentStatus;

  @ApiPropertyOptional({ example: 'ต้องการโปรเจกเตอร์เพิ่ม' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ type: [BookingDetailDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BookingDetailDto)
  details: BookingDetailDto[];
}

export class UpdateBookingStatusDto {
  @ApiProperty({ enum: BookingStatus, example: BookingStatus.APPROVED })
  @IsEnum(BookingStatus)
  booking_status: BookingStatus;

  @ApiPropertyOptional({ enum: PaymentStatus })
  @IsEnum(PaymentStatus)
  @IsOptional()
  payment_status?: PaymentStatus;
}
