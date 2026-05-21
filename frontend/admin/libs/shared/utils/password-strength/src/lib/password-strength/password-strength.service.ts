import { Injectable } from '@angular/core';
import { Options, ZxcvbnResult } from '@zxcvbn-ts/core';
import { PasswordStrengthScore } from './password-strength.types';

type ZxcvbnFunction = (password: string, userInputs?: string[]) => ZxcvbnResult;

@Injectable()
export class PasswordStrengthService {
  private engine: ZxcvbnFunction | null = null;

  async getValidator(): Promise<ZxcvbnFunction> {
    if (this.engine) return this.engine;

    const { zxcvbn, zxcvbnOptions } = await import('@zxcvbn-ts/core');
    const { dictionary, adjacencyGraphs } = await import('@zxcvbn-ts/language-common');
    const { dictionary: enDictionary, translations: enTranslations } = await import(
      '@zxcvbn-ts/language-en'
    );
    const { dictionary: plDictionary, translations: plTranslations } = await import(
      '@zxcvbn-ts/language-pl'
    );

    const options: Partial<Options> = {
      translations: { ...enTranslations, ...plTranslations },
      graphs: { ...adjacencyGraphs },
      dictionary: { ...dictionary, ...enDictionary, ...plDictionary },
    };

    zxcvbnOptions.setOptions(options);
    this.engine = zxcvbn;
    return this.engine;
  }

  getStrengthPercent(
    score: PasswordStrengthScore,
    guessesLog10: ZxcvbnResult['guessesLog10'],
  ): number {
    const thresholds: Record<PasswordStrengthScore, { min: number; max: number }> = {
      0: { min: 0, max: 15 },
      1: { min: 16, max: 30 },
      2: { min: 31, max: 50 },
      3: { min: 51, max: 80 },
      4: { min: 81, max: 100 },
    };

    const { min, max } = thresholds[score];

    const progressInsideThreshold = (guessesLog10 % 3) / 3;
    const calculated = min + progressInsideThreshold * (max - min);

    return Math.round(Math.max(min, Math.min(calculated, max)));
  }
}
