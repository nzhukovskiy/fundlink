import { InvestmentsRepository } from './investments.repository';

describe('InvestmentsRepository', () => {
  it('should be defined', () => {
    expect(new InvestmentsRepository()).toBeDefined();
  });
});
