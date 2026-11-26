import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, MaxLength, IsIn } from 'class-validator';

export class CreateOrganizationDto {
  @ApiProperty({ example: 'บริษัท ABC จำกัด', description: 'ชื่อองค์กร' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  org_name: string;

  @ApiProperty({ example: 'private', description: 'ประเภทองค์กร' })
  @IsIn(['private', 'public'])
  org_type: string;

  @ApiProperty({ example: 'ABC001', description: 'รหัสองค์กร' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  org_code: string;

  @ApiProperty({ example: '123 ถ.สุขุมวิท กรุงเทพ', description: 'ที่อยู่' })
  @IsString()
  @IsNotEmpty()
  address: string;
}
