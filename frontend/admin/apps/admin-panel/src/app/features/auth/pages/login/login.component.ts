import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthWrapperComponent } from '../../components/auth-wrapper/auth-wrapper.component';
import { FormButtonsComponent } from '../../components/form-buttons/form-buttons.component';
import { InputTextComponent } from '@ombro/shared/ui-forms';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [AuthWrapperComponent, FormButtonsComponent, InputTextComponent, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styles: `
    @use '../../styles/common.scss';
    .form-fields {
      display: flex;
      flex-direction: column;
      gap: common.$formFieldsGap;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  protected loginForm = new FormGroup({
    login: new FormControl('', [Validators.required, Validators.pattern(/^\S*$/)]),
    password: new FormControl('', Validators.required),
  });

  protected onSubmit() {}
}
