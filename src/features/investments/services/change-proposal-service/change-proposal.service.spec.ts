import { Test, TestingModule } from '@nestjs/testing';
import { ChangeProposalService } from './change-proposal.service';

describe('ChangeProposalServiceService', () => {
  let service: ChangeProposalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChangeProposalService],
    }).compile();

    service = module.get<ChangeProposalService>(ChangeProposalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
