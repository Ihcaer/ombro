import { hashSync } from 'bcrypt';
import { HashData } from '../../../hash/hash.types';

function hash({ value, saltRounds }: HashData) {
  if (saltRounds < 4 || saltRounds > 32) {
    throw new Error(`Worker received invalid saltRounds: ${saltRounds}`);
  }
  return hashSync(value, saltRounds);
}

module.exports = hash;
