import { Test, TestingModule } from '@nestjs/testing';
import { ToolMaintenanceService } from './tool-maintenance.service';
import { SQL } from '../database/database.module';

describe('ToolMaintenanceService', () => {
  let service: ToolMaintenanceService;
  let sqlMock: any;

  beforeEach(async () => {
    sqlMock = jest.fn().mockResolvedValue([]);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ToolMaintenanceService,
        { provide: SQL, useValue: sqlMock },
      ],
    }).compile();

    service = module.get<ToolMaintenanceService>(ToolMaintenanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
