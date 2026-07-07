import { Exclude, Expose } from 'class-transformer';
import { RedirectCode } from '../enums/redirect-code.enum';

@Exclude()
export class GetRedirectDto {
  @Expose()
  readonly targetUrl!: string;

  @Expose()
  readonly redirectCode!: RedirectCode;
}
