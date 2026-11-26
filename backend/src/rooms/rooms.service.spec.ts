import { Test, TestingModule } from '@nestjs/testing';
import { RoomsService } from './rooms.service';
import { SQL } from '../database/database.module';

describe('RoomsService', () => {
  let service: RoomsService;
  let sqlMock: any;

  beforeEach(async () => {
    sqlMock = jest.fn().mockResolvedValue([]);
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomsService,
        {
          provide: SQL,
          useValue: sqlMock,
        },
      ],
    }).compile();

    service = module.get<RoomsService>(RoomsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find all rooms with filters', async () => {
    const mockRooms = [{ room_id: 1, room_name: '101' }];
    const mockRates = [{ room_rate_id: 1, room_id: 1, price: 100 }];
    
    sqlMock.mockImplementation((strings: any) => {
      if (Array.isArray(strings)) {
        const query = strings.join('');
        if (query.includes('SELECT r.*')) {
          return Promise.resolve(mockRooms);
        }
        if (query.includes('SELECT * FROM room_rate')) {
          return Promise.resolve(mockRates);
        }
      }
      return { toSql: () => 'helper' };
    });
    
    const result = await service.findAll('available', 10, 1);
    expect(result).toEqual([
      { room_id: 1, room_name: '101', room_rates: mockRates }
    ]);
    expect(sqlMock).toHaveBeenCalled();
  });

  it('should find rooms by status', async () => {
    const mockRooms = [{ room_id: 1, room_name: '101', room_status: 'available' }];
    const mockRates = [{ room_rate_id: 1, room_id: 1, price: 100 }];
    sqlMock.mockResolvedValueOnce(mockRooms).mockResolvedValueOnce(mockRates);
    
    const result = await service.findByStatus('available');
    expect(result).toEqual([
      { room_id: 1, room_name: '101', room_status: 'available', room_rates: mockRates }
    ]);
  });

  it('should find one room', async () => {
    const mockRoom = [{ room_id: 1, room_name: '101' }];
    const mockRates = [{ room_rate_id: 1, room_id: 1, price: 100 }];
    sqlMock.mockResolvedValueOnce(mockRoom).mockResolvedValueOnce(mockRates);
    
    const result = await service.findOne(1);
    expect(result).toEqual({ room_id: 1, room_name: '101', room_rates: mockRates });
  });

  it('should throw NotFoundException if room not found', async () => {
    sqlMock.mockResolvedValueOnce([]);
    
    await expect(service.findOne(999)).rejects.toThrow('ไม่พบห้อง id 999');
  });

  it('should create a room', async () => {
    const mockData = [{ room_id: 1, room_name: '101' }];
    sqlMock.mockResolvedValueOnce(mockData);
    
    const result = await service.create({ 
      org_id: 1, 
      room_type_id: 1, 
      room_name: '101', 
      capacity: 10, 
      floor: 1, 
      room_status: 'available' as any 
    });
    expect(result).toEqual(mockData[0]);
  });

  it('should update a room', async () => {
    const mockData = [{ room_id: 1, room_name: '102' }];
    sqlMock.mockResolvedValue(mockData); // Handle findOne, helper, and update
    
    const result = await service.update(1, { room_name: '102' } as any);
    expect(result).toEqual(mockData[0]);
  });

  it('should throw NotFoundException when updating non-existent room', async () => {
    sqlMock.mockResolvedValueOnce([]);
    
    await expect(service.update(999, { room_name: '102' })).rejects.toThrow('ไม่พบห้อง id 999');
  });

  it('should remove a room', async () => {
    sqlMock.mockResolvedValueOnce([{ room_id: 1 }]);
    const result = await service.remove(1);
    expect(result).toEqual({ message: 'ลบห้อง id 1 สำเร็จ' });
  });

  it('should throw NotFoundException when removing non-existent room', async () => {
    sqlMock.mockResolvedValueOnce([]);
    await expect(service.remove(999)).rejects.toThrow('ไม่พบห้อง id 999');
  });
});
