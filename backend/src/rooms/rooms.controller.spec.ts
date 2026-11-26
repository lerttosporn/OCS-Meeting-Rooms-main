import { Test, TestingModule } from '@nestjs/testing';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';

describe('RoomsController', () => {
  let controller: RoomsController;
  let service: RoomsService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findByStatus: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomsController],
      providers: [
        {
          provide: RoomsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<RoomsController>(RoomsController);
    service = module.get<RoomsService>(RoomsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call findAll', async () => {
    const mockData = [{ room_id: 1, room_name: '101' }];
    mockService.findAll.mockResolvedValue(mockData);
    
    expect(await controller.findAll('available', 10, 1)).toEqual(mockData);
    expect(mockService.findAll).toHaveBeenCalledWith('available', 10, 1);
  });

  it('should call findByStatus', async () => {
    const mockData = [{ room_id: 1, room_name: '101', room_status: 'available' }];
    mockService.findByStatus.mockResolvedValue(mockData);
    
    expect(await controller.findByStatus('available')).toEqual(mockData);
    expect(mockService.findByStatus).toHaveBeenCalledWith('available');
  });

  it('should call findOne', async () => {
    const mockData = { room_id: 1, room_name: '101' };
    mockService.findOne.mockResolvedValue(mockData);
    
    expect(await controller.findOne(1 as any)).toEqual(mockData);
    expect(mockService.findOne).toHaveBeenCalledWith(1);
  });

  it('should call create', async () => {
    const dto = { org_id: 1, room_type_id: 1, room_name: '101', capacity: 10, floor: 1, room_status: 'available' as any };
    const mockData = { room_id: 1, ...dto };
    mockService.create.mockResolvedValue(mockData);
    
    expect(await controller.create(dto)).toEqual(mockData);
    expect(mockService.create).toHaveBeenCalledWith(dto);
  });

  it('should call update', async () => {
    const dto = { room_name: '102' };
    const mockData = { room_id: 1, room_name: '102' };
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
