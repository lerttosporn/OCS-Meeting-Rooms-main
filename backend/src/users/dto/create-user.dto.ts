import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString, IsEmail, IsNotEmpty, IsOptional,
  IsEnum, IsInt, MaxLength, IsPositive,
} from 'class-validator';

export enum UserRole {
  CUSTOMER = 'customer',
  STAFF_TECH = 'staff_tech',
  ADMIN = 'admin',
  FINANCIAL = 'financial',
}

export class CreateUserDto {
  @ApiProperty({ example: 1, description: 'org_id ขององค์กร' })
  @IsInt()
  @IsPositive()
  org_id: number;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123', description: 'รหัสผ่าน' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ enum: UserRole, example: UserRole.CUSTOMER })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({ example: 'สมชาย', description: 'ชื่อ' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  first_name: string;

  @ApiPropertyOptional({ example: 'ใจดี', description: 'นามสกุล' })
  @IsString()
  @IsOptional()
  @MaxLength(60)
  last_name?: string;

  @ApiPropertyOptional({ example: '1234567890123', description: 'รหัสบัตรประชาชน 13 หลัก' })
  @IsString()
  @IsOptional()
  @MaxLength(13)
  card_id?: string;

  @ApiPropertyOptional({ example: '0812345678' })
  @IsString()
  @IsOptional()
  @MaxLength(10)
  phone_number?: string;

  @ApiPropertyOptional({ example: 'ผู้จัดการ' })
  @IsString()
  @IsOptional()
  position?: string;
}
