import { Test, TestingModule } from '@nestjs/testing';
import { SeedsController } from './seeds.controller';
import { SeedService } from './seed.service';

describe('SeedsController', () => {
  let controller: SeedsController;
  let service: SeedService;

  const mockSeedService = {
    seed: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SeedsController],
      providers: [
        {
          provide: SeedService,
          useValue: mockSeedService,
        },
      ],
    }).compile();

    controller = module.get<SeedsController>(SeedsController);
    service = module.get<SeedService>(SeedService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('seed', () => {
    it('should seed the database and return success message', async () => {
      mockSeedService.seed.mockResolvedValue(undefined);

      const result = await controller.seed();

      expect(service.seed).toHaveBeenCalled();
      expect(result).toEqual({ message: 'Database seeded successfully!' });
    });

    it('should handle errors during seeding', async () => {
      const error = new Error('Database connection failed');
      mockSeedService.seed.mockRejectedValue(error);

      await expect(controller.seed()).rejects.toThrow('Database connection failed');
      expect(service.seed).toHaveBeenCalled();
    });
  });
}); 