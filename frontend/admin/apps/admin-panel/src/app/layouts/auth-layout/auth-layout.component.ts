import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { provideTranslocoScope } from '@jsverse/transloco';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet],
  providers: [provideTranslocoScope('auth')],
  template: `<div class="layout"><router-outlet /></div> `,
  styles: `
    @use '../common.scss';
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthLayoutComponent {}
