import { Question, QuestionSet } from 'nest-commander';
import { validateEmail } from '../functions/validate-email';

@QuestionSet({ name: 'admin-credentials-questions' })
export class AdminCredentialsQuestions {
  @Question({ type: 'input', name: 'email', message: "Enter first admin's (user) email address:" })
  parseEmail(val: string): string {
    if (!validateEmail(val)) throw Error('This is not a valid email!');
    return val;
  }

  @Question({ type: 'password', name: 'password', message: "Enter first admin's (user) password:" })
  parsePassword(val: string): string {
    return val;
  }
}
