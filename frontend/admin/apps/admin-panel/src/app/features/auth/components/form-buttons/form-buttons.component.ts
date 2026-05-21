import {
  ChangeDetectionStrategy,
  Component,
  contentChild,
  ElementRef,
  input,
  output,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-auth-form-buttons',
  imports: [ButtonModule],
  templateUrl: './form-buttons.component.html',
  styles: `
    @use '../../styles/common.scss';
    :host {
      display: flex;
      flex-direction: column;
      gap: 5px;
      margin-top: common.$elementsGap;
    }
    button {
      width: 100%;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormButtonsComponent {
  hasSecondaryButton = contentChild<ElementRef>('secondaryBtn');

  isDisabled = input<boolean>(false);
  secondaryClick = output<void>();
}
