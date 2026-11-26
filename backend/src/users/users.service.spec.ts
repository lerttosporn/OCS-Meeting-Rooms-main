import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { SQL } from '../database/database.module';

describe('UsersService', () => {
  let service: UsersService;
  let sqlMock: any;

  beforeEach(async () => {
    sqlMock = jest.fn().mockResolvedValue([]);
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: SQL,
          useValue: sqlMock,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find all users', async () => {
    const mockData = [{ user_id: 1, first_name: 'John' }];
    sqlMock.mockResolvedValueOnce(mockData);
    
    const result = await service.findAll();
    expect(result).toEqual(mockData);
    expect(sqlMock).toHaveBeenCalled();
  });

  it('should find one user', async () => {
    const mockData = [{ user_id: 1, first_name: 'John' }];
    sqlMock.mockResolvedValueOnce(mockData);
    
    const result = await service.findOne(1);
    expect(result).toEqual(mockData[0]);
  });

  it('should throw NotFoundException if user not found', async () => {
    sqlMock.mockResolvedValueOnce([]);
    
    await expect(service.findOne(999)).rejects.toThrow('ไม่พบ user id 999');
  });

  it('should create a user', async () => {
    const mockData = [{ user_id: 1, first_name: 'John', email: 'john@example.com' }];
    sqlMock.mockResolvedValueOnce(mockData);
    
    const result = await service.create({ 
      org_id: 1, 
      first_name: 'John', 
      last_name: 'Doe',
      email: 'john@example.com',
      role: 'staff' as any
    });
    expect(result).toEqual(mockData[0]);
  });

  it('should update a user', async () => {
    const mockData = [{ user_id: 1, first_name: 'Jane' }];
    sqlMock.mockResolvedValueOnce(mockData); // findOne
    sqlMock.mockReturnValueOnce('helper'); // this.sql(dto)
    sqlMock.mockResolvedValueOnce(mockData); // update
    
    const result = await service.update(1, { first_name: 'Jane' } as any);
    expect(result).toEqual(mockData[0]);
  });

  it('should throw NotFoundException when updating non-existent user', async () => {
    sqlMock.mockResolvedValueOnce([]);
    
    await expect(service.update(999, { first_name: 'Jane' })).rejects.toThrow('ไม่พบ user id 999');
  });

  it('should remove a user', async () => {
    sqlMock.mockResolvedValueOnce([{ user_id: 1 }]);
    const result = await service.remove(1);
    expect(result).toEqual({ message: 'ลบ user id 1 สำเร็จ' });
  });

  it('should throw NotFoundException when removing non-existent user', async () => {
    sqlMock.mockResolvedValueOnce([]);
    await expect(service.remove(999)).rejects.toThrow('ไม่พบ user id 999');
  });
});
