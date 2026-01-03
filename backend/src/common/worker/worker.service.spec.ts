import { WorkerService, WorkerTask } from './worker.service';

describe('WorkerService', () => {
  let service: WorkerService;
  let piscinaMock: { run: jest.Mock; destroy: jest.Mock };

  beforeEach(() => {
    jest.restoreAllMocks();

    piscinaMock = {
      run: jest.fn(),
      destroy: jest.fn().mockResolvedValue(undefined),
    };

    service = new WorkerService();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (service as any).piscina = piscinaMock;
  });

  it('should catch and propagate errors from worker thread', async () => {
    const errorContent = 'Test internal error';
    const workerError = new Error(errorContent);

    piscinaMock.run.mockRejectedValue(workerError);

    await expect(
      service.runTask(WorkerTask.HASH_DATA, { value: 'test' }),
    ).rejects.toThrow(errorContent);
  });

  it('should process multiple tasks in parallel', async () => {
    piscinaMock.run.mockImplementation(async () => {
      await new Promise((res) => setTimeout(res, 100));
      return 'ok';
    });

    const start = Date.now();
    await Promise.all([
      service.runTask(WorkerTask.HASH_DATA, {}),
      service.runTask(WorkerTask.HASH_DATA, {}),
    ]);

    expect(Date.now() - start).toBeLessThan(150);
  });

  it('should destroy the pool on destroy hook', async () => {
    await service.onModuleDestroy();
    expect(piscinaMock.destroy).toHaveBeenCalled();
  });
});
