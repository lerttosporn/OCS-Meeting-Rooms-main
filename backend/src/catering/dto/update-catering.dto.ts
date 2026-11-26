import { PartialType } from '@nestjs/swagger';
import { CreateCateringDto } from './create-catering.dto';

export class UpdateCateringDto extends PartialType(CreateCateringDto) {}
