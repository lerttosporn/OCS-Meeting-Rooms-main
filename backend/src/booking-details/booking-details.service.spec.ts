import { Test, TestingModule } from '@nestjs/testing';
import { BookingDetailsService } from './booking-details.service';
import { SQL } from '../database/database.module';

describe('BookingDetailsService', () => {
  let service: BookingDetailsService;
  let sqlMock: any;

  beforeEach(async () => {
    sqlMock = jest.fn().mockResolvedValue([]);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingDetailsService,
        { provide: SQL, useValue: sqlMock },
      ],
    }).compile();

    service = module.get<BookingDetailsService>(BookingDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get booking detail with all children', async () => {
    sqlMock.mockResolvedValueOnce([{ booking_detail_id: 1 }]); // detail
    sqlMock.mockResolvedValueOnce([{ booking_tools_id: 1 }]); // tools
    sqlMock.mockResolvedValueOnce([{ booking_catering_id: 1 }]); // catering
    sqlMock.mockResolvedValueOnce([{ booking_network_id: 1 }]); // network

    const result = await service.findOne(1);
    expect(result).toHaveProperty('tools');
    expect(result).toHaveProperty('catering');
    expect(result).toHaveProperty('network');
  });

  it('should remove booking detail and its children', async () => {
    sqlMock.mockResolvedValueOnce([{ booking_detail_id: 1 }]); // findOne
    sqlMock.mockResolvedValueOnce([]); // del tools
    sqlMock.mockResolvedValueOnce([]); // del catering
    sqlMock.mockResolvedValueOnce([]); // del network
    sqlMock.mockResolvedValueOnce([]); // del detail

    const result = await service.remove(1);
    expect(result).toEqual({ message: 'ลบ booking detail id 1 พร้อมข้อมูลย่อยสำเร็จ' });
  });
});
