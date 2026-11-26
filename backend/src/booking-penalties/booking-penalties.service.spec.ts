import { Test, TestingModule } from '@nestjs/testing';
import { BookingPenaltiesService } from './booking-penalties.service';
import { SQL } from '../database/database.module';

describe('BookingPenaltiesService', () => {
  let service: BookingPenaltiesService;
  let sqlMock: any;

  beforeEach(async () => {
    sqlMock = jest.fn().mockResolvedValue([]);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingPenaltiesService,
        { provide: SQL, useValue: sqlMock },
      ],
    }).compile();

    service = module.get<BookingPenaltiesService>(BookingPenaltiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
