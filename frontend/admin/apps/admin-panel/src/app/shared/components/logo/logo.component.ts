import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type logoTypes = 'wordmark' | 'lettermark';

@Component({
  selector: 'app-logo',
  imports: [],
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

  /** @see {@link LogoComponent} */
  readonly variant = input.required<logoTypes>();

  protected readonly imageSrc = computed(
    () => LogoComponent.LOGO_PATH + LogoComponent.LOGO_MAP[this.variant()],
  );
}
