import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail, IsInt, IsNotEmpty, IsOptional,
  IsPositive, IsString, MaxLength, MinLength, IsEnum
} from 'class-validator';
import { UserRole } from './create-user.dto';

export class LoginDto {
  @ApiProperty({ example: 'customer@ocs.com', description: 'อีเมล' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'hashed_pass_123', description: 'รหัสผ่าน' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class RegisterDto {
  @ApiProperty({ example: 1, description: 'org_id ขององค์กร' })
  @IsInt()
  @IsPositive()
  org_id: number;

  @ApiProperty({ example: 'john@example.com', description: 'อีเมล' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123', description: 'รหัสผ่าน (อย่างน้อย 6 ตัว)' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ enum: UserRole, example: UserRole.CUSTOMER, description: 'สิทธิ์ผู้ใช้งาน' })
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

export class GoogleLoginDto {
  @ApiProperty({ example: 'google_id_token', description: 'ID Token จาก Google' })
  @IsString()
  @IsNotEmpty()
  token: string;
}
