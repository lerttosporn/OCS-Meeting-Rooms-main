import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsPositive, IsString, IsNumber, IsEnum, IsOptional, Min, IsDateString } from 'class-validator';

export enum PaymentMethod {
  CASH = 'cash',
  CHEQUE = 'cheque',
  QRCODE = 'qrcode',
  ORG_DEDUCT = 'org_deduct',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export class CreatePaymentDto {
  @ApiProperty({ example: 1, description: 'ID ของ Booking' })
  @IsInt()
  @IsPositive()
  booking_id: number;

  @ApiPropertyOptional({ example: 'RCPT-001', description: 'เลขที่ใบเสร็จ' })
  @IsString()
  @IsOptional()
  receipt_number?: string;

  @ApiPropertyOptional({ example: 'TXN-ABC-123', description: 'เลขอ้างอิงธุรกรรม' })
  @IsString()
  @IsOptional()
  transaction_ref?: string;

  @ApiProperty({ example: 1500.00, description: 'จำนวนเงิน' })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({ example: '2023-10-10T12:00:00Z', description: 'วันที่และเวลาชำระเงิน' })
  @IsDateString()
  payment_date: string;

  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.QRCODE })
  @IsEnum(PaymentMethod)
  payment_method: PaymentMethod;

  @ApiPropertyOptional({ example: 'https://example.com/slip.jpg', description: 'หลักฐานการชำระเงิน' })
  @IsString()
  @IsOptional()
  evidence_url?: string;

  @ApiProperty({ enum: TransactionStatus, example: TransactionStatus.SUCCESS })
  @IsEnum(TransactionStatus)
  transaction_status: TransactionStatus;
}
