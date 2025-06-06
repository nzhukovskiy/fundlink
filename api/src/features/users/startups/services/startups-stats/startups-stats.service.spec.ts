import { Test, TestingModule } from '@nestjs/testing';
import { StartupsStatsService } from './startups-stats.service';

describe('StartupsStatsService', () => {
  let service: StartupsStatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StartupsStatsService],
    }).compile();

    service = module.get<StartupsStatsService>(StartupsStatsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
