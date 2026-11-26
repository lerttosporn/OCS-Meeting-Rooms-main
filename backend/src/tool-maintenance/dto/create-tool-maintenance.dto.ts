import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsPositive, IsString, IsEnum, IsOptional, IsDateString } from 'class-validator';

export enum MaintStatus {
  BROKEN = 'broken',
  WORKING = 'working',
  REPAIRING = 'repairing',
  DISPOSED = 'disposed',
}

export class CreateToolMaintenanceDto {
  @ApiProperty({ example: 1, description: 'ID ของอุปกรณ์' })
  @IsInt()
  @IsPositive()
  tool_id: number;

  @ApiProperty({ example: 1, description: 'ID ของพนักงานที่แจ้ง/ซ่อม' })
  @IsInt()
  @IsPositive()
  staff_id: number;

  @ApiProperty({ enum: MaintStatus, example: MaintStatus.BROKEN })
  @IsEnum(MaintStatus)
  status: MaintStatus;

  @ApiPropertyOptional({ example: 'ไฟไม่ติด', description: 'รายละเอียดการแจ้งซ่อม' })
  @IsString()
  @IsOptional()
  report_details?: string;

  @ApiPropertyOptional({ example: '2023-10-10T12:00:00Z', description: 'วันที่ซ่อมเสร็จ' })
  @IsDateString()
  @IsOptional()
  resolved_at?: string;
}
