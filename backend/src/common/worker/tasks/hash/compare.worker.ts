import { compareSync } from 'bcrypt';
import { CompareHashData } from '../../../hash/hash.types';

function compare({ comparedValue, originalValue }: CompareHashData): boolean {
  return compareSync(comparedValue, originalValue);
}

module.exports = compare;
