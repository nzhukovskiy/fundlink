import { Test, TestingModule } from '@nestjs/testing';
import { FundingRoundsController } from './funding-rounds.controller';

describe('FundingRoundsController', () => {
  let controller: FundingRoundsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FundingRoundsController],
    }).compile();

    controller = module.get<FundingRoundsController>(FundingRoundsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
