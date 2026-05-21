import { ErrorResponseBody } from '@ombro/admin-panel/app/core/config/types/error-response-body.type';

export const mapAuthHttpErrorToMessage = (
  errorCode: ErrorResponseBody['errorCode'],
): string | null => {
  switch (errorCode) {
    case 'INVALID_CREDENTIALS':
      return 'Nieprawidłowe dane uwierzytelniające.';
    case 'EMAIL_NOT_VERIFIED':
      return 'E-mail niezweryfikowany. W celu weryfikacji postępuj zgodnie z instrukcjami przesłanymi na e-mail.';
    case 'WEAK_PASSWORD':
      return 'Podczas resetowania hasła wystąpił nieoczekiwany problem. Spróbuj ponownie później. Jeśli problem będzie się powtarzał, skontaktuj się z naszym zespołem wsparcia.';
    default:
      return 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie za chwilę.';
  }
};
