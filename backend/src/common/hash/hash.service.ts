import { Injectable } from '@nestjs/common';
import path from 'node:path';
import { Worker } from 'node:worker_threads';

@Injectable()
export class HashService {
  async hash(data: string, saltRounds: number = 12): Promise<string> {
    return new Promise((resolve, reject) => {
      const workerPath = path.resolve(__dirname, 'worker', 'worker.js');
      const worker = new Worker(workerPath, {
        workerData: { data, saltRounds },
      });

      worker.on('message', (message: { result: string }) => {
        resolve(message.result);
      });

      worker.on('error', (err) => {
        reject(err);
        worker.terminate();
      });

      worker.on('exit', (code) => {
        if (code !== 0) {
          reject(new Error('Worker stopped with exit code ' + code));
        }
      });
    });
  }
}
