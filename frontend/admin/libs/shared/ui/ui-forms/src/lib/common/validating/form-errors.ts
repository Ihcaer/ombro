const FORM_ERRORS_TRANSLATION_PREFIX = 'common.forms.errors.' as const;

export const FORM_ERRORS = {
  required: { key: FORM_ERRORS_TRANSLATION_PREFIX + 'required' },
  minLength: { key: FORM_ERRORS_TRANSLATION_PREFIX + 'minLength', params: ['min'] },
  email: { key: FORM_ERRORS_TRANSLATION_PREFIX + 'email' },
  pattern: { key: FORM_ERRORS_TRANSLATION_PREFIX + 'invalidPattern' },
  forbiddenChars: { key: FORM_ERRORS_TRANSLATION_PREFIX + 'forbiddenChars', params: ['chars'] },
  matchFields: { key: FORM_ERRORS_TRANSLATION_PREFIX + 'matchFields', params: ['fieldName'] },
  weakPassword: { key: FORM_ERRORS_TRANSLATION_PREFIX + 'weakPassword' },
} as const;

export type FormErrorCode = keyof typeof FORM_ERRORS;
export type FormError = { code: FormErrorCode; params?: Record<string, unknown> };
