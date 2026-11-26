import { PartialType } from '@nestjs/swagger';
import { CreateToolMaintenanceDto } from './create-tool-maintenance.dto';

export class UpdateToolMaintenanceDto extends PartialType(CreateToolMaintenanceDto) {}
