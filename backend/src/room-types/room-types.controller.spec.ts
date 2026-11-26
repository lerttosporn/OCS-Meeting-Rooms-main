import { Test, TestingModule } from '@nestjs/testing';
import { RoomTypesController } from './room-types.controller';
import { RoomTypesService } from './room-types.service';

describe('RoomTypesController', () => {
  let controller: RoomTypesController;
  let service: RoomTypesService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomTypesController],
      providers: [
        {
          provide: RoomTypesService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<RoomTypesController>(RoomTypesController);
    service = module.get<RoomTypesService>(RoomTypesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call findAll', async () => {
    const mockData = [{ room_type_id: 1, name: 'Lecture' }];
    mockService.findAll.mockResolvedValue(mockData);
    
    expect(await controller.findAll()).toEqual(mockData);
    expect(mockService.findAll).toHaveBeenCalled();
  });

  it('should call findOne', async () => {
    const mockData = { room_type_id: 1, name: 'Lecture' };
    mockService.findOne.mockResolvedValue(mockData);
    
    expect(await controller.findOne(1 as any)).toEqual(mockData);
    expect(mockService.findOne).toHaveBeenCalledWith(1);
  });

  it('should call create', async () => {
    const dto = { name: 'Lecture', description: 'Desc' };
    const mockData = { room_type_id: 1, ...dto };
    mockService.create.mockResolvedValue(mockData);
    
    expect(await controller.create(dto)).toEqual(mockData);
    expect(mockService.create).toHaveBeenCalledWith(dto);
  });

  it('should call update', async () => {
    const dto = { name: 'Updated' };
    const mockData = { room_type_id: 1, name: 'Updated' };
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
