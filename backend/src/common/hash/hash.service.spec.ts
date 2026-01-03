import { Test, TestingModule } from '@nestjs/testing';
import { HashService } from './hash.service';
import { WorkerService, WorkerTask } from '@common/worker/worker.service';
import { ConfigService } from '@nestjs/config';

describe('HashService', () => {
  let service: HashService;
  let workerService: WorkerService;

  beforeEach(async () => {
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HashService,
        { provide: WorkerService, useValue: { runTask: jest.fn() } },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'server.hashSecret') return 'test_secret';
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<HashService>(HashService);
    workerService = module.get<WorkerService>(WorkerService);
  });

  describe('.hashBcrypt()', () => {
    it('should call runTask with correct payload', async () => {
      const runTaskSpy = jest
        .spyOn(workerService, 'runTask')
        .mockResolvedValue('hashed_value');

      await service.hashBcrypt('password', 4);

      expect(runTaskSpy).toHaveBeenCalledWith(WorkerTask.HASH_DATA, {
        value: 'password',
        saltRounds: 4,
      });
    });
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
    ])(
      'should return $expected for scenario: $desc',
      ({ input, originalValue, expected }) => {
        const hashedOriginal = service.hash(originalValue);
        expect(service.compareHash(input, hashedOriginal)).toBe(expected);
      },
    );

    it('should return false when lengths are different', () => {
      const input = 'value';
      const longHash = 'a'.repeat(64);
      expect(service.compareHash(input, longHash)).toBe(false);
    });
  });
});
