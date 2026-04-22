import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class IdGeneratorService {
  private counters: Record<string, number> = {};

  generate(prefix: string): string {
    if (this.counters[prefix] === undefined) this.counters[prefix] = 0;
    return `${prefix}-${++this.counters[prefix]}`;
  }
}
