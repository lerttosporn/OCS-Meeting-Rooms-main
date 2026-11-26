import { Test, TestingModule } from '@nestjs/testing';
import { RoomTypesService } from './room-types.service';
import { SQL } from '../database/database.module';

describe('RoomTypesService', () => {
  let service: RoomTypesService;
  let sqlMock: any;

  beforeEach(async () => {
    sqlMock = jest.fn().mockResolvedValue([]);
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomTypesService,
        {
          provide: SQL,
          useValue: sqlMock,
        },
      ],
    }).compile();

    service = module.get<RoomTypesService>(RoomTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find all room types', async () => {
    const mockData = [{ room_type_id: 1, name: 'Lecture' }];
    sqlMock.mockResolvedValueOnce(mockData);
    
    const result = await service.findAll();
    expect(result).toEqual(mockData);
    expect(sqlMock).toHaveBeenCalled();
  });

  it('should find one room type', async () => {
    const mockData = [{ room_type_id: 1, name: 'Lecture' }];
    sqlMock.mockResolvedValueOnce(mockData);
    
    const result = await service.findOne(1);
    expect(result).toEqual(mockData[0]);
  });

  it('should throw NotFoundException if room type not found', async () => {
    sqlMock.mockResolvedValueOnce([]);
    
    await expect(service.findOne(999)).rejects.toThrow('ไม่พบประเภทห้อง id 999');
  });

  it('should create a room type', async () => {
    const mockData = [{ room_type_id: 1, name: 'Lecture', description: 'Desc' }];
    sqlMock.mockResolvedValueOnce(mockData);
    
    const result = await service.create({ name: 'Lecture', description: 'Desc' });
    expect(result).toEqual(mockData[0]);
  });

  it('should update a room type', async () => {
    const mockData = [{ room_type_id: 1, name: 'Updated' }];
    sqlMock.mockResolvedValueOnce(mockData); // findOne
    sqlMock.mockReturnValueOnce('helper'); // this.sql(dto)
    sqlMock.mockResolvedValueOnce(mockData); // update
    
    const result = await service.update(1, { name: 'Updated' } as any);
    expect(result).toEqual(mockData[0]);
  });

  it('should throw NotFoundException when updating non-existent room type', async () => {
    sqlMock.mockResolvedValueOnce([]);
    
    await expect(service.update(999, { name: 'Updated' })).rejects.toThrow('ไม่พบประเภทห้อง id 999');
  });

  it('should remove a room type', async () => {
    sqlMock.mockResolvedValueOnce([{ room_type_id: 1 }]);
    const result = await service.remove(1);
    expect(result).toEqual({ message: 'ลบประเภทห้อง id 1 สำเร็จ' });
  });

  it('should throw NotFoundException when removing non-existent room type', async () => {
    sqlMock.mockResolvedValueOnce([]);
    await expect(service.remove(999)).rejects.toThrow('ไม่พบประเภทห้อง id 999');
  });
});
