import { Test, TestingModule } from '@nestjs/testing';
import { NetworkPackagesController } from './network-packages.controller';
import { NetworkPackagesService } from './network-packages.service';

describe('NetworkPackagesController', () => {
  let controller: NetworkPackagesController;
  let mockService = {
    findAll: jest.fn().mockResolvedValue([]),
    findOne: jest.fn().mockResolvedValue({}),
    create: jest.fn().mockResolvedValue({}),
    update: jest.fn().mockResolvedValue({}),
    remove: jest.fn().mockResolvedValue({}),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NetworkPackagesController],
      providers: [{ provide: NetworkPackagesService, useValue: mockService }],
    }).compile();

    controller = module.get<NetworkPackagesController>(NetworkPackagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
