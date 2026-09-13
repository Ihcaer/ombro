import { parseTranslationMessage, translationMessage } from './translation-message';

describe('translationMessage', () => {
  it('returns key without params', () => {
    expect(translationMessage('validation.required')).toBe('validation.required');
  });

  it('serializes params', () => {
    expect(
      translationMessage('validation.minLength', {
        min: 8,
      }),
    ).toBe('validation.minLength|{"min":8}');
  });
});

describe('parseTranslocoMessage', () => {
  it('parses message without params', () => {
    expect(parseTranslationMessage('validation.required')).toEqual({
      key: 'validation.required',
    });
  });

  it('parses message with params', () => {
    expect(parseTranslationMessage('validation.minLength|{"min":8}')).toEqual({
      key: 'validation.minLength',
      params: {
        min: 8,
      },
    });
  });

  it('supports complex MessageFormat params', () => {
    expect(parseTranslationMessage('validation.foo|{"count":5,"type":"password"}')).toEqual({
      key: 'validation.foo',
      params: {
        count: 5,
        type: 'password',
      },
    });
  });

  it('does not split params by separator', () => {
    const message = translationMessage('validation.foo', {
      value: 'foo|bar',
    });

    expect(parseTranslationMessage(message)).toEqual({
      key: 'validation.foo',
      params: {
        value: 'foo|bar',
      },
    });
  });
});
