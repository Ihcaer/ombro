import { WorkerService, WorkerTask } from '@common/worker/worker.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HashService {
  constructor(private readonly workerService: WorkerService) {}

  /**
   * Hashes string value in the working thread.
   * @param value Value to be hashed.
   * @param saltRounds Number of salt round that will be done.
   * @return Promise with string hashed value.
   */
  async hash(value: string, saltRounds: number = 12): Promise<string> {
    const data = { value, saltRounds };

    return this.workerService.runTask<string>(WorkerTask.HASH_DATA, data);
  }
}
