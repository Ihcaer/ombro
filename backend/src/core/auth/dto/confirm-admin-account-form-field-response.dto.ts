import { PossibleFieldsToFill } from '../types/common.types';

// export type ConfirmAdminAccountFormFieldResponseDto = (keyof PossibleFieldsToFill)[];

const _POSSIBLE_FIELDS = [
  'password',
  'handleName',
] as const satisfies readonly (keyof PossibleFieldsToFill)[];

type PossibleField = (typeof _POSSIBLE_FIELDS)[number];

export class ConfirmAdminAccountFormFieldResponseDto {
  fields!: PossibleField[];
}
