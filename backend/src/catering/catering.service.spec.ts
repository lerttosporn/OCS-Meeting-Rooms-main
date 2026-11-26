import { Test, TestingModule } from '@nestjs/testing';
import { CateringService } from './catering.service';
import { SQL } from '../database/database.module';

describe('CateringService', () => {
  let service: CateringService;
  let sqlMock: any;

  beforeEach(async () => {
    sqlMock = jest.fn().mockResolvedValue([]);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CateringService,
        { provide: SQL, useValue: sqlMock },
      ],
    }).compile();

    service = module.get<CateringService>(CateringService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
