import { StartupsRepository } from './startups.repository';

describe('StartupsRepository', () => {
  it('should be defined', () => {
    expect(new StartupsRepository()).toBeDefined();
  });
});
