import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { translateSignal } from '@jsverse/transloco';
import { TranslocoRootScopeService } from '@ombro/shared/utils/translation-utils';

export type logoTypes = 'wordmark' | 'lettermark';

@Component({
  selector: 'app-logo',
  imports: [RouterLink, NgTemplateOutlet],
  providers: [TranslocoRootScopeService],
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoComponent {
  private static readonly LOGO_PATH = 'assets/icons/brand/';
  private static readonly LOGO_MAP: Record<logoTypes, string> = {
    wordmark: 'wordmark.svg',
    lettermark: 'lettermark.svg',
  };

  private readonly translocoRootScope = inject(TranslocoRootScopeService);

  /** @see {@link LogoComponent} */
  readonly variant = input<logoTypes>('lettermark');
  readonly enableReference = input<boolean>(true);

  protected ariaLabel = this.translocoRootScope.translate('common.misc.mainPageLabel');

  protected readonly imageSrc = computed(
    () => LogoComponent.LOGO_PATH + LogoComponent.LOGO_MAP[this.variant()],
  );
}
