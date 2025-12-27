import bcrypt from 'bcrypt';
import * as compareWorker from './compare.worker';
import { CompareHashData } from '../../../hash/hash.types';

jest.mock('bcrypt');

type CompareWorkerFn = (data: CompareHashData) => boolean;

describe('HashCompareWorker', () => {
  let compareFn: CompareWorkerFn;
  const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

  beforeEach(() => {
    const workerModule = compareWorker as { default: CompareWorkerFn };
    compareFn = workerModule.default;
    jest.clearAllMocks();
  });

  describe('Compare function', () => {
    it.each([
      {
        firstValue: 'value',
        hash: 'hashedValue',
        expected: true,
        desc: 'correct value',
      },
      {
        firstValue: 'value',
        hash: 'hashedValue',
        expected: false,
        desc: 'wrong value',
      },
    ])(
      'should return $expected for scenario: $desc',
      ({ firstValue, hash, expected }) => {
        mockedBcrypt.compareSync.mockReturnValue(expected);

        const result = compareFn({
          comparedValue: firstValue,
          originalValue: hash,
        });

        expect(result).toBe(expected);
        expect(mockedBcrypt.compareSync).toHaveBeenCalledWith(firstValue, hash);
      },
    );
  });
});
