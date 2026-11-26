import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateNetworkPackageDto {
  @ApiProperty({ example: 'Package 1', description: 'ชื่อแพ็กเกจเครือข่าย' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'ใช้', description: 'การใช้งานอินเทอร์เน็ต' })
  @IsString()
  @IsNotEmpty()
  internet: string;

  @ApiProperty({ example: 'ไม่มี', description: 'การติดตั้งเซิร์ฟเวอร์' })
  @IsString()
  @IsNotEmpty()
  server_installation: string;

  @ApiPropertyOptional({ example: 'หากใช้พอร์ตนอกเหนือจากพอร์ท 80 หรือ 443 โปรดระบุ URL และพอร์ท', description: 'ข้อมูลทางเทคนิค' })
  @IsString()
  @IsOptional()
  technical_info?: string;
}
