import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { RedirectCode } from '../enums/redirect-code.enum';

export class CreateUrlRedirectDto {
  @IsString({ message: 'Source URL should be a string.' })
  @IsNotEmpty({ message: 'Source URL is required.' })
  readonly sourceUrl: string;

  @IsString({ message: 'Target URL should be a string.' })
  @IsNotEmpty({ message: 'Target URL is required.' })
  readonly targetUrl: string;

  @IsEnum(RedirectCode, {
    message:
      'Redirect Code must be one of the allowed values: 301, 302, 307, 308',
  })
  @IsNotEmpty({ message: 'Redirect Code is required' })
  readonly redirectCode: RedirectCode;
}
