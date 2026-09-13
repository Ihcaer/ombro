import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { parseTranslationMessage } from '@ombro/shared/utils/translation-utils';

@Component({
  selector: 'ombro-input-error-message',
  imports: [TranslocoPipe],
  template: `<small class="error-message" [class.active]="!!errorMessage()">
    {{
      translatedMessage()
        ? (translatedMessage()!.key | transloco: translatedMessage()?.params)
        : '&nbsp;'
    }}
  </small>`,
  styles: `
    $errorTextColor: var(--p-form-field-invalid-border-color);
    .error-message {
      color: transparent;
      transition: color 300ms ease;
    }
    .error-message.active {
      color: $errorTextColor;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorMessageComponent {
  readonly errorMessage = input.required<string | null>();

  protected translatedMessage = computed(() => {
    const errorMessage = this.errorMessage();
    if (!errorMessage) return null;

    return parseTranslationMessage(errorMessage);
  });
}
