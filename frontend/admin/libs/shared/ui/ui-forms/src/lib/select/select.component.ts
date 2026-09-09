import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  Renderer2,
  signal,
  viewChild,
} from '@angular/core';
import { LabelComponent } from '../common/label/label.component';
import { FormsModule } from '@angular/forms';
import { Select, SelectModule } from 'primeng/select';
import { IconName } from '@ombro/shared/ui/ui-icons';
import { BaseInputControl } from '../base-input-control';
import { ErrorMessageComponent } from '../common/validating/error-message.component';

@Component({
  selector: 'ombro-select',
  imports: [LabelComponent, SelectModule, FormsModule, ErrorMessageComponent],
  templateUrl: './select.component.html',
  styles: `
    @use '../../styles/common.scss';
    .force-hover:not(.p-disabled):not(.p-focus) {
      border-color: var(--p-select-hover-border-color);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent extends BaseInputControl<unknown> {
  private renderer = inject(Renderer2);

  readonly select = viewChild.required<Select>('select');
  private labelComponent = viewChild(LabelComponent, { read: ElementRef });

  label = input<string>();
  labelIcon = input<IconName>();
  placeholder = input<string>();
  options = input.required<unknown[]>();
  optionLabel = input<string>();
  optionValue = input<string>();
  showClear = input<boolean>(false);
  virtualScroll = input<boolean>(false);
  virtualScrollItemSize = input<number>();
  multiple = input<boolean>(false);

  protected isLabelHovered = signal<boolean>(false);

  constructor() {
    super();

    effect(() => {
      const wrapper = this.labelComponent()?.nativeElement;
      const label = wrapper?.querySelector('label');

      if (label) {
        this.renderer.removeAttribute(label, 'for');
      }
    });
  }

  open(): void {
    this.select().show();
  }
}
