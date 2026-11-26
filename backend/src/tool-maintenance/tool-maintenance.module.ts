import { Module } from '@nestjs/common';
import { ToolMaintenanceController } from './tool-maintenance.controller';
import { ToolMaintenanceService } from './tool-maintenance.service';

@Module({
  controllers: [ToolMaintenanceController],
  providers: [ToolMaintenanceService]
})
export class ToolMaintenanceModule {}
