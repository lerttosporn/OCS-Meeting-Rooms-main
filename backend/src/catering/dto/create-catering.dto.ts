import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCateringDto {
  @ApiProperty({ example: 'คอฟฟี่เบรก ชุด A', description: 'ชื่อรายการอาหารจัดเลี้ยง' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'กาแฟ 1 แก้ว + ขนม 2 ชิ้น', description: 'รายละเอียดเพิ่มเติม' })
  @IsString()
  @IsOptional()
  description?: string;
}
