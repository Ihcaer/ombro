import { Inject, Injectable } from '@nestjs/common';
import { CompareHashData, HashData } from './hash.types';
import { createHash, timingSafeEqual } from 'node:crypto';
import type { ConfigType } from '@nestjs/config';
import { WorkerService, WorkerTask } from '@shared/worker/worker.service';
import securityConfig from '@core/config/envs/security.config';

@Injectable()
export class HashService {
  static readonly DEFAULT_SALT_ROUNDS: number = 12;

  constructor(
    private readonly workerService: WorkerService,
    @Inject(securityConfig.KEY)
    private readonly securityConf: ConfigType<typeof securityConfig>,
  ) {}

  /**
   * Hashes string value in the working thread.
   * @param value String value to be hashed.
   * @param saltRounds Number of salt round that will be done.
   * @returns Promise with string hashed value.
   */
  async hashBcrypt(
    value: string,
    saltRounds: number = HashService.DEFAULT_SALT_ROUNDS,
  ): Promise<string> {
    if (!(saltRounds >= 4 && saltRounds <= 32)) {
      throw new Error('Salt rounds must be between 4 and 32');
    }
    const data: HashData = { value, saltRounds };

    return this.workerService.runTask<string>(WorkerTask.HASH_DATA, data);
  }

  /**
   * Compares given string values in the working thread.
   * @param comparedValue String value from user to be compared.
   * @param originalValue String value saved in app to be compared.
   * @returns Promise with boolean result of comparing.
   */
  async compareBcrypt(
    comparedValue: string,
    originalValue: string,
  ): Promise<boolean> {
    const data: CompareHashData = { comparedValue, originalValue };

    return this.workerService.runTask<boolean>(WorkerTask.COMPARE_HASH, data);
  }

  compareHash(inputHashed: string, savedHash: string): boolean {
    const inputBuffer = Buffer.from(inputHashed, 'hex');
    const hashBuffer = Buffer.from(savedHash, 'hex');
    if (inputBuffer.length !== hashBuffer.length) return false;

    return timingSafeEqual(inputBuffer, hashBuffer);
  }

  hash(value: string): string {
    return createHash('sha256').update(value).digest('hex');
  }
}
