# translation-utils

The library provides a simple way to store a Transloco translation key together with its parameters in a single string and parse it back when the message needs to be translated.

This is useful in places where an API accepts only a string, while you still want to use _Transloco_ parameters and MessageFormat.

## Features

- Framework-agnostic
- No dependency on Angular or Transloco
- Store translation keys and parameters in a single string
- Parse serialized translation messages back into a structured object
- Works with Transloco parameters and MessageFormat
- Fully type-safe at the utility API level

## Installation

```ts
import { translationMessage, parseTranslationMessage } from '@ombro/translation-utils';
```

## Creating a translation message

Use `translationMessage()` to combine a translation key with optional parameters:

```ts
translationMessage('validation.required'); // => 'validation.required'
```

With parameters:

```ts
translationMessage('validation.minLength', { min: 8 }); // => 'validation.minLength|{"min":8}'
```

Complex parameters are supported as well:

```ts
translationMessage('validation.passwordStrength', { count: 8, type: 'password' });
```

The returned value is always a string, which makes it suitable for APIs that accept only strings.

## Parsing a translation message

Use `parseTranslationMessage()` to convert a serialized message back into a structured object:

```ts
const message = parseTranslationMessage('validation.minLength|{"min":8}');
```

Result:

```ts
{ key: 'validation.minLength', params: { min: 8 } }
```

A message without parameters is also supported:

```ts
parseTranslationMessage('validation.required');
```

Result:

```ts
{
  key: 'validation.required';
}
```

## Transloco integration

The library does not depend on _Transloco_. It only handles serialization and parsing.

After parsing, the returned values can be passed directly to _Transloco_:

```ts
{{ message.key | transloco: message.params }}
```

This makes the utilities compatible with Transloco MessageFormat.

For example, given the translation:

```json
{
  "validation": {
    "minLength": "Minimum {min} characters.",
    "items": "{count, plural, =0 {No items} one {One item} other {# items}}."
  }
}
```

you can create messages with:

```ts
translationMessage('validation.minLength', { min: 8 });
translationMessage('validation.items', { count: 5 });
```

and pass the parsed parameters to Transloco:

```ts
const { key, params } = parseTranslationMessage(message);
translate(key, params);
```

The MessageFormat syntax is handled by Transloco; this library does not interpret or modify the parameters.

## Use cases

The utilities are particularly useful when a third-party or framework API accepts a `string`, but you need to preserve translation parameters.

For example, Angular Signal Forms validators accept a string `message`:

```ts
minLength(path.password, 8, { message: translationMessage('validation.minLength', { min: 8 }) });
```

The validator still receives a plain string: `validation.minLength|{"min":8}`

Later, the message can be parsed and translated:

```ts
const message = parseTranslationMessage(error.message);
translate(message.key, message.params);
```

The library itself has no knowledge of Signal Forms, validators, or Angular.

## Message format

Serialized messages use the following format: `<translation-key>|<JSON-encoded-parameters>`

For example: `validation.minLength|{"min":8}`

When no parameters are provided, only the translation key is returned: `validation.required`

The separator is only used to separate the translation key from the JSON payload. Parameters are serialized as JSON, so values containing the separator are supported:

```ts
translationMessage('example.message', { value: 'foo|bar' });
```

## API

### `translationMessage()`

```ts
const translationMessage = (key: string, params?: Record<string, unknown>): string;
```

Creates a serialized translation message.

### `parseTranslationMessage()`

```ts
const parseTranslationMessage = (message: string): TranslocoMessage;
```

Parses a serialized translation message.

### `TranslationMessage()`

```ts
type TranslationMessage = { key: string; params?: Record<string, unknown> };
```

Represents a parsed translation message.

## Design principles

This library intentionally does not provide:

- _Angular_-specific utilities
- _Transloco_ services or pipes
- Custom validators
- Translation logic
- MessageFormat parsing

Its responsibility is limited to one thing:

> Serialize and deserialize translation keys and their parameters.

This keeps the library reusable across Angular libraries, UI components, validation, errors, notifications, and other parts of the application.

## Running unit tests

Run `nx test translation-utils` to execute the unit tests.
