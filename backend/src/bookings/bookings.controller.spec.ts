import { Test, TestingModule } from '@nestjs/testing';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';

describe('BookingsController', () => {
  let controller: BookingsController;
  let service: BookingsService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    updateStatus: jest.fn(),
    findByUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingsController],
      providers: [
        {
          provide: BookingsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<BookingsController>(BookingsController);
    service = module.get<BookingsService>(BookingsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call findAll', async () => {
    const mockData = [{ booking_id: 1, purpose: 'Meeting' }];
    mockService.findAll.mockResolvedValue(mockData);
    
    expect(await controller.findAll('confirmed')).toEqual(mockData);
    expect(mockService.findAll).toHaveBeenCalledWith('confirmed');
  });

  it('should call findByStatus', async () => {
    const mockData = [{ booking_id: 1, purpose: 'Meeting' }];
    mockService.findAll.mockResolvedValue(mockData);
    
    expect(await controller.findByStatus('confirmed')).toEqual(mockData);
    expect(mockService.findAll).toHaveBeenCalledWith('confirmed');
  });

  it('should call findOne', async () => {
    const mockData = { booking_id: 1, purpose: 'Meeting' };
    mockService.findOne.mockResolvedValue(mockData);
    
    expect(await controller.findOne(1 as any)).toEqual(mockData);
    expect(mockService.findOne).toHaveBeenCalledWith(1);
  });

  it('should call create', async () => {
    const dto = {
      customer_id: 1,
      staff_id: 2,
      total_amount: 1500,
      booking_status: 'draft' as any,
      payment_status: 'unpaid' as any,
      details: [],
    };
    const mockData = { booking_id: 1, ...dto };
    mockService.create.mockResolvedValue(mockData);
    
    expect(await controller.create(dto)).toEqual(mockData);
    expect(mockService.create).toHaveBeenCalledWith(dto);
  });

  it('should call updateStatus', async () => {
    const dto = { booking_status: 'approved' as any };
    const mockData = { booking_id: 1, booking_status: 'approved' };
    mockService.updateStatus.mockResolvedValue(mockData);
    
    expect(await controller.updateStatus(1 as any, dto)).toEqual(mockData);
    expect(mockService.updateStatus).toHaveBeenCalledWith(1, dto);
  });

  it('should call findByUser', async () => {
    const mockData = [{ booking_id: 1, purpose: 'Meeting' }];
    mockService.findByUser.mockResolvedValue(mockData);
    
    expect(await controller.findByUser(1, 'confirmed')).toEqual(mockData);
    expect(mockService.findByUser).toHaveBeenCalledWith(1, 'confirmed');
  });

  it('should call findByUserAndStatus', async () => {
    const mockData = [{ booking_id: 1, purpose: 'Meeting' }];
    mockService.findByUser.mockResolvedValue(mockData);
    
    expect(await controller.findByUserAndStatus(1, 'confirmed')).toEqual(mockData);
    expect(mockService.findByUser).toHaveBeenCalledWith(1, 'confirmed');
  });
});
