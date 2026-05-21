import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconName } from '@ombro/shared/ui-icons';
import { IdGeneratorService } from '@ombro/shared/util-ui';
import { InputTextModule } from 'primeng/inputtext';
import { Password, PasswordModule } from 'primeng/password';
import { LabelComponent } from '../label/label.component';
import { BaseCvaComponent } from '../base-cva-component';
import { ProgressBarModule } from 'primeng/progressbar';
import {
  PasswordStrengthScore,
  PasswordStrengthService,
} from '@ombro/shared/utils/password-strength';
import { NgClass } from '@angular/common';
import { ErrorMessageComponent } from '../error-message/error-message.component';
import { passwordStrengthErrorMessage } from './password-strength-error-message';

@Component({
  selector: 'ombro-input-text',
  imports: [
    FormsModule,
    InputTextModule,
    PasswordModule,
    LabelComponent,
    ProgressBarModule,
    NgClass,
    ErrorMessageComponent,
  ],
  providers: [PasswordStrengthService],
  templateUrl: './input-text.component.html',
  styleUrl: './input-text.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputTextComponent extends BaseCvaComponent<string> {
  private readonly idGeneratorService = inject(IdGeneratorService);
  private readonly passwordStrengthService = inject(PasswordStrengthService);
  private readonly passwordComponent = viewChild<Password>('passwordInput');

  readonly type = input<'text' | 'email' | 'password'>('text');
  readonly autocomplete = input<string>('on');
  readonly placeholder = input<string>('');
  readonly label = input<string>();
  /**
   * Description: {@link IconComponent}
   */
  readonly labelIcon = input<IconName>();
  readonly showPasswordStrength = input<boolean>(false);
  readonly allowedPasswordScore = input<PasswordStrengthScore>(2);
  sendPasswordStrengthScore = output<PasswordStrengthScore>({ alias: 'passwordStrengthScore' });

  protected isLabelHovered = signal<boolean>(false);
  protected readonly actualPasswordStrengthScore = signal<PasswordStrengthScore>(0);
  protected readonly actualPasswordPercentageStrength = signal<number>(0);

  protected readonly inputId = this.idGeneratorService.generate('inputText');

  protected readonly passwordStrengthMessage = computed<string | undefined>(() => {
    const passwordScore: PasswordStrengthScore = this.actualPasswordStrengthScore();
    const message = passwordStrengthErrorMessage;

    return message[passwordScore] || undefined;
  });

  protected onLabelClick(): void {
    const passwordInput = this.passwordComponent();
    if (passwordInput) {
      const input = passwordInput.el.nativeElement.querySelector('input');
      input.focus();
    }
  }

  protected onInputFromEvent(event: Event): void {
    this.onInput((event.target as HTMLInputElement).value);
  }

  protected onInput(value: string): void {
    if (this.type() === 'password') this.onPasswordInput(value);
    this.setValue(value ?? '');
  }

  protected handleBlur(): void {
    this.markAsTouched();
  }

  private async onPasswordInput(password: string): Promise<void> {
    const zxcvbn = await this.passwordStrengthService.getValidator();
    const result = zxcvbn(password);
    const score = result.score;

    this.sendPasswordStrengthScore.emit(score);

    if (this.showPasswordStrength()) {
      this.actualPasswordStrengthScore.set(score);
      this.actualPasswordPercentageStrength.set(
        this.passwordStrengthService.getStrengthPercent(score, result.guessesLog10),
      );
    }
  }
}
