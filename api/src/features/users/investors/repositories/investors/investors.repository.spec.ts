import { InvestorsRepository } from './investors.repository';

describe('InvestorsRepository', () => {
  it('should be defined', () => {
    expect(new InvestorsRepository()).toBeDefined();
  });
});
