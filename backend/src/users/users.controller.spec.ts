import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call findAll', async () => {
    const mockData = [{ user_id: 1, first_name: 'John' }];
    mockService.findAll.mockResolvedValue(mockData);
    
    expect(await controller.findAll()).toEqual(mockData);
    expect(mockService.findAll).toHaveBeenCalled();
  });

  it('should call findOne', async () => {
    const mockData = { user_id: 1, first_name: 'John' };
    mockService.findOne.mockResolvedValue(mockData);
    
    expect(await controller.findOne(1 as any)).toEqual(mockData);
    expect(mockService.findOne).toHaveBeenCalledWith(1);
  });

  it('should call create', async () => {
    const dto = { org_id: 1, first_name: 'John', last_name: 'Doe', email: 'john@test.com', role: 'staff' as any };
    const mockData = { user_id: 1, ...dto };
    mockService.create.mockResolvedValue(mockData);
    
    expect(await controller.create(dto)).toEqual(mockData);
    expect(mockService.create).toHaveBeenCalledWith(dto);
  });

  it('should call update', async () => {
    const dto = { first_name: 'Jane' };
    const mockData = { user_id: 1, first_name: 'Jane' };
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
