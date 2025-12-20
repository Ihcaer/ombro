import * as hashWorker from './hash.worker';
import { compare } from 'bcrypt';

type HashWorkerFn = (data: {
  value: string;
  saltRounds: number;
}) => Promise<string>;

describe('HashWorker', () => {
  let hashFn: HashWorkerFn;

  beforeEach(() => {
    const workerModule = hashWorker as { default: HashWorkerFn };
    hashFn = workerModule.default;
  });

  it('should hash a password correctly', async () => {
    const password = 'test-password';
    const input = { value: password, saltRounds: 4 };

    const result = await hashFn(input);

    expect(result).toBeDefined();
    expect(typeof result).toBe('string');

    const isCorrect = await compare(password, result);
    expect(isCorrect).toBe(true);
  });

  describe('Validation correct saltRound value range', () => {
    it.each([
      { salt: 1, shouldThrow: true },
      { salt: 33, shouldThrow: true },
      { salt: -1, shouldThrow: true },
      { salt: 12, shouldThrow: false },
    ])(
      'should process when number is in the range',
      ({ salt, shouldThrow }) => {
        const call = () => hashFn({ value: 'test', saltRounds: salt });

        if (shouldThrow) {
          expect(call).toThrow();
        } else {
          expect(call).not.toThrow();
        }
      },
    );
  });
});
