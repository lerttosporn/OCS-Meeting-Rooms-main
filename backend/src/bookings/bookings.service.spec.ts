import { Test, TestingModule } from '@nestjs/testing';
import { BookingsService } from './bookings.service';
import { SQL } from '../database/database.module';

describe('BookingsService', () => {
  let service: BookingsService;
  let sqlMock: any;

  beforeEach(async () => {
    sqlMock = jest.fn().mockResolvedValue([]);
    sqlMock.begin = jest.fn().mockImplementation((cb) => cb(sqlMock));
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        {
          provide: SQL,
          useValue: sqlMock,
        },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find all bookings', async () => {
    const mockData = [{ booking_id: 1, title: 'Meeting' }];
    sqlMock.mockResolvedValue(mockData);
    
    const result = await service.findAll();
    expect(result).toEqual(mockData);
    expect(sqlMock).toHaveBeenCalled();
  });

  it('should find bookings by status', async () => {
    const mockData = [{ booking_id: 1, title: 'Meeting', booking_status: 'confirmed' }];
    sqlMock.mockResolvedValue(mockData);
    
    const result = await service.findAll('confirmed');
    expect(result).toEqual(mockData);
    expect(sqlMock).toHaveBeenCalled();
  });

  it('should find bookings by status mapping complete to completed', async () => {
    const mockData = [{ booking_id: 1, title: 'Meeting', booking_status: 'completed' }];
    sqlMock.mockResolvedValue(mockData);
    
    const result = await service.findAll('complete');
    expect(result).toEqual(mockData);
    expect(sqlMock).toHaveBeenCalled();
  });

  it('should find one booking', async () => {
    const mockData = [{ booking_id: 1, title: 'Meeting' }];
    sqlMock.mockResolvedValueOnce(mockData); // booking
    sqlMock.mockResolvedValueOnce([]); // details
    
    const result = await service.findOne(1);
    expect(result).toEqual({ ...mockData[0], details: [] });
  });

  it('should throw NotFoundException if booking not found', async () => {
    sqlMock.mockResolvedValueOnce([]);
    
    await expect(service.findOne(999)).rejects.toThrow('ไม่พบ booking id 999');
  });

  it('should create a booking', async () => {
    const mockBooking = [{ booking_id: 1, title: 'Meeting' }];
    sqlMock.mockResolvedValueOnce([]); // checkRoomAvailability -> no conflict
    sqlMock.mockResolvedValueOnce(mockBooking); // INSERT booking
    sqlMock.mockResolvedValueOnce([{}]); // INSERT booking_detail
    
    const result = await service.create({ 
      customer_id: 1,
      staff_id: 2,
      total_amount: 1500,
      booking_status: 'draft' as any,
      payment_status: 'unpaid' as any,
      details: [{
        room_id: 1,
        start_date: '2023-10-10',
        end_date: '2023-10-10',
        start_time: '10:00:00',
        end_time: '12:00:00',
        price_snapshot: 1500,
        tools: [],
      }]
    });
    expect(result).toBeDefined();
  });

  it('should throw ConflictException when room is not available', async () => {
    const conflicting = [{
      booking_detail_id: 99,
      start_date: '2023-10-10',
      end_date: '2023-10-10',
      start_time: '09:00:00',
      end_time: '11:00:00',
      booking_status: 'confirmed',
    }];
    sqlMock.mockResolvedValueOnce(conflicting); // checkRoomAvailability -> conflict found

    await expect(service.create({
      customer_id: 1,
      staff_id: 2,
      total_amount: 1500,
      booking_status: 'draft' as any,
      payment_status: 'unpaid' as any,
      details: [{
        room_id: 1,
        start_date: '2023-10-10',
        end_date: '2023-10-10',
        start_time: '10:00:00',
        end_time: '12:00:00',
        price_snapshot: 1500,
        tools: [],
      }]
    })).rejects.toThrow('ห้อง id 1 ไม่ว่างในช่วงเวลาที่เลือก');
  });

  it('should update booking status', async () => {
    const mockData = [{ booking_id: 1, booking_status: 'approved' }];
    sqlMock.mockResolvedValueOnce([{ booking_id: 1, booking_status: 'pending' }]); // findOne (booking)
    sqlMock.mockResolvedValueOnce([]); // findOne (details)
    sqlMock.mockResolvedValueOnce(mockData); // update
    
    const result = await service.updateStatus(1, { booking_status: 'approved' as any });
    expect(result).toEqual(mockData[0]);
  });

  it('should throw NotFoundException when updating status of non-existent booking', async () => {
    sqlMock.mockResolvedValueOnce([]); // find
    
    await expect(service.updateStatus(999, { booking_status: 'approved' as any })).rejects.toThrow('ไม่พบ booking id 999');
  });

  it('should find bookings by user id', async () => {
    const mockData = [{ booking_id: 1, customer_id: 1 }];
    sqlMock.mockResolvedValue(mockData);
    
    const result = await service.findByUser(1);
    expect(result).toEqual(mockData);
    expect(sqlMock).toHaveBeenCalled();
  });

  it('should find bookings by user id and status', async () => {
    const mockData = [{ booking_id: 1, customer_id: 1, booking_status: 'confirmed' }];
    sqlMock.mockResolvedValue(mockData);
    
    const result = await service.findByUser(1, 'confirmed');
    expect(result).toEqual(mockData);
    expect(sqlMock).toHaveBeenCalled();
  });

  it('should find bookings by user id and status mapping complete to completed', async () => {
    const mockData = [{ booking_id: 1, customer_id: 1, booking_status: 'completed' }];
    sqlMock.mockResolvedValue(mockData);
    
    const result = await service.findByUser(1, 'complete');
    expect(result).toEqual(mockData);
    expect(sqlMock).toHaveBeenCalled();
  });
});
