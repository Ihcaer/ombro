import { hashSync } from 'bcrypt';

function hash(data: { value: string; saltRounds: number }) {
  return hashSync(data.value, data.saltRounds);
}

module.exports = hash;
