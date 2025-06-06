import { Test, TestingModule } from '@nestjs/testing';
import { FundingRoundsService } from './funding-rounds.service';

describe('FundingRoundsService', () => {
  let service: FundingRoundsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FundingRoundsService],
    }).compile();

    service = module.get<FundingRoundsService>(FundingRoundsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
