type LoginErrorCode = 'INVALID_CREDENTIALS' | 'EMAIL_NOT_VERIFIED';
type PasswordResetErrorCode = 'WEAK_PASSWORD';

export type ErrorResponseBody = {
  readonly errorCode: LoginErrorCode | PasswordResetErrorCode | undefined;
  readonly message: string;
};
