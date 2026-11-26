import { Test, TestingModule } from '@nestjs/testing';
import { CateringController } from './catering.controller';
import { CateringService } from './catering.service';

describe('CateringController', () => {
  let controller: CateringController;
  let mockService = {
    findAll: jest.fn().mockResolvedValue([]),
    findOne: jest.fn().mockResolvedValue({}),
    create: jest.fn().mockResolvedValue({}),
    update: jest.fn().mockResolvedValue({}),
    remove: jest.fn().mockResolvedValue({}),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CateringController],
      providers: [{ provide: CateringService, useValue: mockService }],
    }).compile();

    controller = module.get<CateringController>(CateringController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
