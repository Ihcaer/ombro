import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { resolve } from 'node:path';
import { availableParallelism } from 'node:os';
import Piscina from 'piscina';

export enum WorkerTask {
  HASH_DATA = 'hashData',
}

const TASK_PATHS: Record<WorkerTask, string> = {
  [WorkerTask.HASH_DATA]: resolve(__dirname, 'tasks', 'hash', 'hash.worker.js'),
};

@Injectable()
export class WorkerService implements OnModuleInit, OnModuleDestroy {
  private piscina: Piscina;

  private readonly minThreads = 1;
  private readonly maxThreads = availableParallelism();

  onModuleInit() {
    this.piscina = new Piscina({
      minThreads: this.minThreads,
      maxThreads: this.maxThreads,
    });
  }

  async onModuleDestroy() {
    if (this.piscina) await this.piscina.destroy();
  }

  /**
   * A universal method for running tasks.
   * @param taskType Task type (e.g. WorkerTask.HASH_DATA).
   * @param data Data to be passed to the worker.
   * @returns Promise with the result of the task.
   */
  async runTask<T>(taskType: WorkerTask, data: any): Promise<T> {
    const filename = TASK_PATHS[taskType];
    const taskName = taskType;

    if (!filename) throw new Error('Path not found for task: ' + taskType);

    return this.piscina.run(data, {
      filename,
      name: taskName,
    }) as Promise<T>;
  }
}
