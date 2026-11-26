import { Test, TestingModule } from '@nestjs/testing';
import { ToolMaintenanceController } from './tool-maintenance.controller';
import { ToolMaintenanceService } from './tool-maintenance.service';

describe('ToolMaintenanceController', () => {
  let controller: ToolMaintenanceController;
  let mockService = {
    findAll: jest.fn().mockResolvedValue([]),
    findOne: jest.fn().mockResolvedValue({}),
    create: jest.fn().mockResolvedValue({}),
    update: jest.fn().mockResolvedValue({}),
    remove: jest.fn().mockResolvedValue({}),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ToolMaintenanceController],
      providers: [{ provide: ToolMaintenanceService, useValue: mockService }],
    }).compile();

    controller = module.get<ToolMaintenanceController>(ToolMaintenanceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
