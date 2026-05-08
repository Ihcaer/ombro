import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconName } from '@ombro/shared/ui-icons';
import { IdGeneratorService } from '@ombro/shared/util-ui';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { LabelComponent } from '../label/label.component';
import { BaseCvaComponent } from '../base-cva-component';

@Component({
  selector: 'ombro-input-text',
  imports: [FormsModule, InputTextModule, PasswordModule, LabelComponent],
  templateUrl: './input-text.component.html',
  styleUrl: './input-text.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputTextComponent extends BaseCvaComponent<string> {
  private readonly idGeneratorService = inject(IdGeneratorService);

  readonly type = input<'text' | 'email' | 'password'>('text');
  readonly autocomplete = input<string>('on');
  readonly placeholder = input<string>('');
  readonly label = input<string>();
  /**
   * Description: {@link IconComponent}
   */
  readonly labelIcon = input<IconName>();

  protected readonly inputId = this.idGeneratorService.generate('inputText');

  protected onInputFromEvent(event: Event): void {
    this.onInput((event.target as HTMLInputElement).value);
  }

  protected onInput(value: string): void {
    this.setValue(value ?? '');
  }

  protected handleBlur(): void {
    this.markAsTouched();
  }
}
