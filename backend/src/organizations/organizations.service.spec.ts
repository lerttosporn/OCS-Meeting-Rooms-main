import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationsService } from './organizations.service';
import { SQL } from '../database/database.module';

describe('OrganizationsService', () => {
  let service: OrganizationsService;
  let sqlMock: any;

  beforeEach(async () => {
    sqlMock = jest.fn().mockResolvedValue([]);
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganizationsService,
        {
          provide: SQL,
          useValue: sqlMock,
        },
      ],
    }).compile();

    service = module.get<OrganizationsService>(OrganizationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find all organizations', async () => {
    const mockData = [{ org_id: 1, name: 'Org 1' }];
    sqlMock.mockResolvedValueOnce(mockData);
    
    const result = await service.findAll();
    expect(result).toEqual(mockData);
    expect(sqlMock).toHaveBeenCalled();
  });

  it('should find one organization', async () => {
    const mockData = [{ org_id: 1, name: 'Org 1' }];
    sqlMock.mockResolvedValueOnce(mockData);
    
    const result = await service.findOne(1);
    expect(result).toEqual(mockData[0]);
  });

  it('should throw NotFoundException if organization not found', async () => {
    sqlMock.mockResolvedValueOnce([]);
    
    await expect(service.findOne(999)).rejects.toThrow('ไม่พบองค์กร id 999');
  });

  it('should create an organization', async () => {
    const mockData = [{ org_id: 1, name: 'New Org', code: 'NEW' }];
    sqlMock.mockResolvedValueOnce(mockData);
    
    const result = await service.create({ name: 'New Org', code: 'NEW' });
    expect(result).toEqual(mockData[0]);
  });

  it('should update an organization', async () => {
    const mockData = [{ org_id: 1, name: 'Updated Org', code: 'NEW' }];
    sqlMock.mockResolvedValueOnce(mockData); // for findOne
    sqlMock.mockReturnValueOnce('helper'); // this.sql(dto)
    sqlMock.mockResolvedValueOnce(mockData); // for update
    
    const result = await service.update(1, { name: 'Updated Org' } as any);
    expect(result).toEqual(mockData[0]);
  });

  it('should throw NotFoundException when updating non-existent organization', async () => {
    sqlMock.mockResolvedValueOnce([]);
    
    await expect(service.update(999, { name: 'Updated Org' })).rejects.toThrow('ไม่พบองค์กร id 999');
  });

  it('should remove an organization', async () => {
    sqlMock.mockResolvedValueOnce([{ org_id: 1 }]);
    const result = await service.remove(1);
    expect(result).toEqual({ message: 'ลบองค์กร id 1 สำเร็จ' });
  });

  it('should throw NotFoundException when removing non-existent organization', async () => {
    sqlMock.mockResolvedValueOnce([]);
    await expect(service.remove(999)).rejects.toThrow('ไม่พบองค์กร id 999');
  });
});
