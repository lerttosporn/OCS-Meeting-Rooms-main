import { Test, TestingModule } from '@nestjs/testing';
import { CartsService } from './carts.service';
import { SQL } from '../database/database.module';

describe('CartsService', () => {
  let service: CartsService;
  let sqlMock: any;

  beforeEach(async () => {
    sqlMock = jest.fn().mockResolvedValue([]);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartsService,
        { provide: SQL, useValue: sqlMock },
      ],
    }).compile();

    service = module.get<CartsService>(CartsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get cart with items', async () => {
    sqlMock.mockResolvedValueOnce([{ cart_id: 1 }]); // cart
    sqlMock.mockResolvedValueOnce([{ cart_item_id: 1 }]); // items
    const result = await service.getCart(1);
    expect(result).toHaveProperty('items');
  });

  it('should clear cart', async () => {
    sqlMock.mockResolvedValueOnce([{ cart_id: 1 }]);
    sqlMock.mockResolvedValueOnce([]); // delete items
    sqlMock.mockResolvedValueOnce([]); // delete cart
    const result = await service.clearCart(1);
    expect(result).toEqual({ message: 'ลบตระกร้าของ user 1 สำเร็จ' });
  });
});
