import { Test, TestingModule } from '@nestjs/testing';
import { RoomRatesService } from './room-rates.service';
import { SQL } from '../database/database.module';

describe('RoomRatesService', () => {
  let service: RoomRatesService;
  let sqlMock: any;

  beforeEach(async () => {
    sqlMock = jest.fn().mockResolvedValue([]);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomRatesService,
        { provide: SQL, useValue: sqlMock },
      ],
    }).compile();

    service = module.get<RoomRatesService>(RoomRatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find all room rates', async () => {
    const mockData = [{ room_rate_id: 1, price: 500 }];
    sqlMock.mockResolvedValueOnce(mockData);
    expect(await service.findAll()).toEqual(mockData);
  });

  it('should find one room rate', async () => {
    const mockData = [{ room_rate_id: 1, price: 500 }];
    sqlMock.mockResolvedValueOnce(mockData);
    expect(await service.findOne(1)).toEqual(mockData[0]);
  });

  it('should create room rate', async () => {
    const mockData = [{ room_rate_id: 1, price: 500 }];
    sqlMock.mockResolvedValueOnce(mockData);
    expect(await service.create({ room_id: 1, rate_type: 'hourly' as any, price: 500 })).toEqual(mockData[0]);
  });
});
