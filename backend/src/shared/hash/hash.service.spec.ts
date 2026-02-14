import { Test, TestingModule } from '@nestjs/testing';
import { HashService } from './hash.service';

describe('HashService', () => {
  let service: HashService;
  beforeEach(async () => {
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [HashService],
    }).compile();

    service = module.get<HashService>(HashService);
  });

  describe('.compareHash()', () => {
    it.each([
      {
        input: 'value',
        originalValue: 'value',
        expected: true,
        desc: 'correct value',
      },
      {
        input: 'wrongValue',
        originalValue: 'value',
        expected: false,
        desc: 'wrong value',
      },
    ])('should return $expected for scenario: $desc', ({ input, originalValue, expected }) => {
      const hashedInput = service.hash(input);
      const hashedOriginal = service.hash(originalValue);
      expect(service.compareHash(hashedInput, hashedOriginal)).toBe(expected);
    });

    it('should return false when lengths are different', () => {
      const input = 'value';
      const longHash = 'a'.repeat(64);
      expect(service.compareHash(input, longHash)).toBe(false);
    });
  });
});
