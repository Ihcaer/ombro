export type RequestPasswordResetRequestDto = { readonly email: string };
export type ResetPasswordRequestDto = { readonly token: string; readonly password: string };
