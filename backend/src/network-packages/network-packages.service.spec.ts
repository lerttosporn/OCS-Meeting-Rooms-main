import { Test, TestingModule } from '@nestjs/testing';
import { NetworkPackagesService } from './network-packages.service';
import { SQL } from '../database/database.module';

describe('NetworkPackagesService', () => {
  let service: NetworkPackagesService;
  let sqlMock: any;

  beforeEach(async () => {
    sqlMock = jest.fn().mockResolvedValue([]);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NetworkPackagesService,
        { provide: SQL, useValue: sqlMock },
      ],
    }).compile();

    service = module.get<NetworkPackagesService>(NetworkPackagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
