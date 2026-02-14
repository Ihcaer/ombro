import { Injectable } from '@nestjs/common';
import { createHash, timingSafeEqual } from 'node:crypto';
import { compare, hash } from 'bcrypt';

@Injectable()
export class HashService {
  static readonly DEFAULT_SALT_ROUNDS: number = 12;

  async hashBcrypt(
    value: string,
    saltRounds: number = HashService.DEFAULT_SALT_ROUNDS,
  ): Promise<string> {
    if (!(saltRounds >= 4 && saltRounds <= 32)) {
      throw new Error('Salt rounds must be between 4 and 32');
    }
    return await hash(value, saltRounds);
  }

  async compareBcrypt(comparedValue: string, originalValue: string): Promise<boolean> {
    return compare(comparedValue, originalValue);
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
