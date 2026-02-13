import { Type } from '@nestjs/common';

type EventDefinition = Type<any> & { readonly EVENT_NAME: string };

const REQUIRED_EVENT_NAME_STRUCTURE: RegExp = /^[^.]+\.[^.]+$/;

export const EventConfig = (constructor: EventDefinition) => {
  if (!constructor.EVENT_NAME || !REQUIRED_EVENT_NAME_STRUCTURE.test(constructor.EVENT_NAME))
    throw new Error(
      `[Validation error]: The ${constructor.EVENT_NAME} class must have a non-empty static EVENT_NAME defined!`,
    );
};
