export type OneTimeTokenType = 'url_magic_link';

export type OneTimeTokenState = {
  readonly oneTimeToken: string | null;
  readonly type: OneTimeTokenType | null;
  readonly isLoading: boolean;
};

export const initialState: OneTimeTokenState = { oneTimeToken: null, type: null, isLoading: false };
