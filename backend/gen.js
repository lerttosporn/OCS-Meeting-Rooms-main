const fs = require('fs');
const modules = ['payments', 'tools', 'tool-maintenance', 'catering', 'network-packages', 'booking-penalties'];

modules.forEach(mod => {
  const camelName = mod.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
  const serviceName = camelName + 'Service';
  const controllerName = camelName + 'Controller';

  const serviceSpec = `import { Test, TestingModule } from '@nestjs/testing';
import { ${serviceName} } from './${mod}.service';
import { SQL } from '../database/database.module';

describe('${serviceName}', () => {
  let service: ${serviceName};
  let sqlMock: any;

  beforeEach(async () => {
    sqlMock = jest.fn().mockResolvedValue([]);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ${serviceName},
        { provide: SQL, useValue: sqlMock },
      ],
    }).compile();

    service = module.get<${serviceName}>(${serviceName});
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
`;

  const controllerSpec = `import { Test, TestingModule } from '@nestjs/testing';
import { ${controllerName} } from './${mod}.controller';
import { ${serviceName} } from './${mod}.service';

describe('${controllerName}', () => {
  let controller: ${controllerName};
  let mockService = {
    findAll: jest.fn().mockResolvedValue([]),
    findOne: jest.fn().mockResolvedValue({}),
    create: jest.fn().mockResolvedValue({}),
    update: jest.fn().mockResolvedValue({}),
    remove: jest.fn().mockResolvedValue({}),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [${controllerName}],
      providers: [{ provide: ${serviceName}, useValue: mockService }],
    }).compile();

    controller = module.get<${controllerName}>(${controllerName});
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
`;

  fs.writeFileSync(`src/${mod}/${mod}.service.spec.ts`, serviceSpec);
  fs.writeFileSync(`src/${mod}/${mod}.controller.spec.ts`, controllerSpec);
});
console.log('Specs generated!');
