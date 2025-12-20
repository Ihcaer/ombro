import { hashSync } from 'bcrypt';

function hash({ value, saltRounds }: { value: string; saltRounds: number }) {
  if (saltRounds < 4 || saltRounds > 32) {
    throw new Error(`Worker received invalid saltRounds: ${saltRounds}`);
  }
  return hashSync(value, saltRounds);
}

module.exports = hash;
