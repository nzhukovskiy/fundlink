import { Test, TestingModule } from '@nestjs/testing';
import { InvestorVoteService } from './investor-vote.service';

describe('InvestorVoteServiceService', () => {
  let service: InvestorVoteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InvestorVoteService],
    }).compile();

    service = module.get<InvestorVoteService>(InvestorVoteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
