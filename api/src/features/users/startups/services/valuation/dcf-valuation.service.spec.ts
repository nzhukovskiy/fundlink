import { Test, TestingModule } from '@nestjs/testing';
import { DcfValuationService } from './dcf-valuation.service';

describe('ValuationService', () => {
  let service: DcfValuationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DcfValuationService],
    }).compile();

    service = module.get<DcfValuationService>(DcfValuationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
