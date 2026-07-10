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
import { LabelComponent } from '../label/label.component';
import { IdGeneratorService } from '@ombro/shared/utils/util-id';
import { FormsModule } from '@angular/forms';
import { SelectChangeEvent, SelectModule } from 'primeng/select';
import { IconName } from '@ombro/shared/ui/ui-icons';
import { BaseCvaComponent } from '../base-cva-component';
import { ErrorMessageComponent } from '../error-message/error-message.component';

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
export class SelectComponent extends BaseCvaComponent<unknown> {
  private idGeneratorService = inject(IdGeneratorService);
  private renderer = inject(Renderer2);
  private labelComponent = viewChild(LabelComponent, { read: ElementRef });

  label = input<string>();
  labelIcon = input<IconName>();
  placeholder = input<string>();
  options = input.required<unknown[]>();
  showClear = input<boolean>(false);
  virtualScroll = input<boolean>(false);
  virtualScrollItemSize = input<number>();

  protected labelId = this.idGeneratorService.generate('select-label');
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

  protected handleSelectChange(event: SelectChangeEvent): void {
    const newValue = event.value !== undefined ? event.value : event;

    if (this.value() !== newValue) {
      this.setValue(newValue);
    }
  }

  protected handleBlur(): void {
    this.markAsTouched();
  }
}
