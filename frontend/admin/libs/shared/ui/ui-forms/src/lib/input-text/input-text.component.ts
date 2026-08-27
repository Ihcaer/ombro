import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconComponent, IconName } from '@ombro/shared/ui/ui-icons';
import { IdGeneratorService } from '@ombro/shared/utils/util-id';
import { InputTextModule } from 'primeng/inputtext';
import { InputPasswordModule } from 'primeng/inputpassword';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
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
    InputPasswordModule,
    IconFieldModule,
    InputIconModule,
    IconComponent,
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

  protected readonly actualPasswordStrengthScore = signal<PasswordStrengthScore>(0);
  protected readonly actualPasswordPercentageStrength = signal<number>(0);
  readonly mask = signal<boolean>(true);

  protected readonly inputId = this.idGeneratorService.generate('inputText');

  protected readonly passwordStrengthMessage = computed<string | undefined>(() => {
    const passwordScore: PasswordStrengthScore = this.actualPasswordStrengthScore();
    const message = passwordStrengthErrorMessage;

    return message[passwordScore] || undefined;
  });

  protected onInput(input: Event): void {
    const value = (input.target as HTMLInputElement).value;

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
