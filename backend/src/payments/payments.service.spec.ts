import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';
import { SQL } from '../database/database.module';

describe('PaymentsService', () => {
  let service: PaymentsService;
  let sqlMock: any;

  beforeEach(async () => {
    sqlMock = jest.fn().mockResolvedValue([]);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        { provide: SQL, useValue: sqlMock },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
