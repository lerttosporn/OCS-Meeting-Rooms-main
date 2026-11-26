import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationsController } from './organizations.controller';
import { OrganizationsService } from './organizations.service';

describe('OrganizationsController', () => {
  let controller: OrganizationsController;
  let service: OrganizationsService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrganizationsController],
      providers: [
        {
          provide: OrganizationsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<OrganizationsController>(OrganizationsController);
    service = module.get<OrganizationsService>(OrganizationsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call findAll', async () => {
    const mockData = [{ org_id: 1, name: 'Org 1' }];
    mockService.findAll.mockResolvedValue(mockData);
    
    expect(await controller.findAll()).toEqual(mockData);
    expect(mockService.findAll).toHaveBeenCalled();
  });

  it('should call findOne', async () => {
    const mockData = { org_id: 1, name: 'Org 1' };
    mockService.findOne.mockResolvedValue(mockData);
    
    expect(await controller.findOne(1 as any)).toEqual(mockData);
    expect(mockService.findOne).toHaveBeenCalledWith(1);
  });

  it('should call create', async () => {
    const dto = { name: 'Org 1', code: 'ORG' };
    const mockData = { org_id: 1, ...dto };
    mockService.create.mockResolvedValue(mockData);
    
    expect(await controller.create(dto)).toEqual(mockData);
    expect(mockService.create).toHaveBeenCalledWith(dto);
  });

  it('should call update', async () => {
    const dto = { name: 'Updated Org' };
    const mockData = { org_id: 1, name: 'Updated Org', code: 'ORG' };
    mockService.update.mockResolvedValue(mockData);
    
    expect(await controller.update(1 as any, dto)).toEqual(mockData);
    expect(mockService.update).toHaveBeenCalledWith(1, dto);
  });

  it('should call remove', async () => {
    mockService.remove.mockResolvedValue({ message: 'Deleted' });
    
    expect(await controller.remove(1 as any)).toEqual({ message: 'Deleted' });
    expect(mockService.remove).toHaveBeenCalledWith(1);
  });
});
