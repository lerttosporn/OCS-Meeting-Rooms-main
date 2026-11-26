import { Test, TestingModule } from '@nestjs/testing';
import { ToolsService } from './tools.service';
import { SQL } from '../database/database.module';

describe('ToolsService', () => {
  let service: ToolsService;
  let sqlMock: any;

  beforeEach(async () => {
    sqlMock = jest.fn().mockResolvedValue([]);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ToolsService,
        { provide: SQL, useValue: sqlMock },
      ],
    }).compile();

    service = module.get<ToolsService>(ToolsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
