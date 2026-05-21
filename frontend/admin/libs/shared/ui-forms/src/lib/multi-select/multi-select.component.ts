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
import { FormsModule } from '@angular/forms';
import { MultiSelect, MultiSelectChangeEvent, MultiSelectModule } from 'primeng/multiselect';
import { LabelComponent } from '../label/label.component';
import { IdGeneratorService } from '@ombro/shared/util-ui';
import { IconName } from '@ombro/shared/ui-icons';
import { BaseCvaComponent } from '../base-cva-component';
import { ErrorMessageComponent } from '../error-message/error-message.component';

@Component({
  selector: 'ombro-multi-select',
  imports: [LabelComponent, MultiSelectModule, FormsModule, ErrorMessageComponent],
  templateUrl: './multi-select.component.html',
  styles: `
    @use '../../styles/common.scss';
    .force-hover:not(.p-disabled):not(.p-focus) {
      border-color: var(--p-select-hover-border-color);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiSelectComponent extends BaseCvaComponent<unknown[]> {
  private readonly idGeneratorService = inject(IdGeneratorService);
  private readonly renderer = inject(Renderer2);
  private readonly labelComponent = viewChild(LabelComponent, { read: ElementRef });
  private readonly multiSelectComponent = viewChild<MultiSelect>('multiSelect');

  label = input<string>();
  labelIcon = input<IconName>();
  placeholder = input<string>();
  options = input.required<unknown[]>();
  showClear = input<boolean>(false);
  virtualScroll = input<boolean>(false);
  virtualScrollItemSize = input<number>();
  // MultiSelect specified
  maxSelectedLabels = input<number>();
  useChips = input<boolean>(false);
  search = input<boolean>(true);

  protected labelId = this.idGeneratorService.generate('multi-select-label');
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

  protected onLabelClick() {
    const multiSelect = this.multiSelectComponent();

    if (multiSelect) {
      multiSelect.show();

      const input = multiSelect.el.nativeElement.querySelector('input');
      input.focus();
    }
  }

  protected handleMultiSelectChange(event: MultiSelectChangeEvent): void {
    const newValue = event.value !== undefined ? event.value : event;
    if (this.value() !== newValue) this.setValue(newValue);
  }

  protected handleBlur(): void {
    this.markAsTouched();
  }
}
