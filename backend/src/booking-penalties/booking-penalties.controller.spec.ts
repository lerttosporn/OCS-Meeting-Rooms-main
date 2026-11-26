import { Test, TestingModule } from '@nestjs/testing';
import { BookingPenaltiesController } from './booking-penalties.controller';
import { BookingPenaltiesService } from './booking-penalties.service';

describe('BookingPenaltiesController', () => {
  let controller: BookingPenaltiesController;
  let mockService = {
    findAll: jest.fn().mockResolvedValue([]),
    findOne: jest.fn().mockResolvedValue({}),
    create: jest.fn().mockResolvedValue({}),
    update: jest.fn().mockResolvedValue({}),
    remove: jest.fn().mockResolvedValue({}),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingPenaltiesController],
      providers: [{ provide: BookingPenaltiesService, useValue: mockService }],
    }).compile();

    controller = module.get<BookingPenaltiesController>(BookingPenaltiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
