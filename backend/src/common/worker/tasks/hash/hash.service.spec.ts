import { Test, TestingModule } from '@nestjs/testing';
import { HashService } from './hash.service';
import { WorkerService, WorkerTask } from '@common/worker/worker.service';

describe('HashService', () => {
  let service: HashService;
  let workerService: WorkerService;

  beforeEach(async () => {
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HashService,
        { provide: WorkerService, useValue: { runTask: jest.fn() } },
      ],
    }).compile();

    service = module.get<HashService>(HashService);
    workerService = module.get<WorkerService>(WorkerService);
  });

  it('should call runTask with correct payload', async () => {
    const runTaskSpy = jest
      .spyOn(workerService, 'runTask')
      .mockResolvedValue('hashed_value');

    // 2. Wywołanie
    await service.hash('password', 4);

    expect(runTaskSpy).toHaveBeenCalledWith(WorkerTask.HASH_DATA, {
      value: 'password',
      saltRounds: 4,
    });
  });
});
