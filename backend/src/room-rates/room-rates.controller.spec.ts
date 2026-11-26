import { Test, TestingModule } from '@nestjs/testing';
import { RoomRatesController } from './room-rates.controller';
import { RoomRatesService } from './room-rates.service';

describe('RoomRatesController', () => {
  let controller: RoomRatesController;
  let mockService = {
    findAll: jest.fn().mockResolvedValue([]),
    findOne: jest.fn().mockResolvedValue({}),
    create: jest.fn().mockResolvedValue({}),
    update: jest.fn().mockResolvedValue({}),
    remove: jest.fn().mockResolvedValue({}),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomRatesController],
      providers: [{ provide: RoomRatesService, useValue: mockService }],
    }).compile();

    controller = module.get<RoomRatesController>(RoomRatesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
