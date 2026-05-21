import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ombro-input-error-message',
  imports: [],
  template: `<small class="error-message" [class.active]="!!errorMessage()">{{
    errorMessage()
  }}</small>`,
  styles: `
    $errorTextColor: var(--p-form-field-invalid-border-color);
    .error-message {
      color: transparent;
      transition: color 300ms ease;
    }
    .error-message.active {
      color: $errorTextColor;
    }
    .error-message:empty::before {
      content: '\u00a0';
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorMessageComponent {
  readonly errorMessage = input.required<string | null>();
}
