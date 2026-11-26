import { Test, TestingModule } from '@nestjs/testing';
import { BookingDetailsController } from './booking-details.controller';
import { BookingDetailsService } from './booking-details.service';

describe('BookingDetailsController', () => {
  let controller: BookingDetailsController;
  let mockService = {
    findAll: jest.fn().mockResolvedValue([]),
    findOne: jest.fn().mockResolvedValue({}),
    create: jest.fn().mockResolvedValue({}),
    update: jest.fn().mockResolvedValue({}),
    remove: jest.fn().mockResolvedValue({}),
    addTool: jest.fn().mockResolvedValue({}),
    removeTool: jest.fn().mockResolvedValue({}),
    addCatering: jest.fn().mockResolvedValue({}),
    removeCatering: jest.fn().mockResolvedValue({}),
    addNetwork: jest.fn().mockResolvedValue({}),
    removeNetwork: jest.fn().mockResolvedValue({}),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingDetailsController],
      providers: [{ provide: BookingDetailsService, useValue: mockService }],
    }).compile();

    controller = module.get<BookingDetailsController>(BookingDetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
