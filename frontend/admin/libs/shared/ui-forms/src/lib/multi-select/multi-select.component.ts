import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  forwardRef,
  inject,
  input,
  Renderer2,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MultiSelect, MultiSelectChangeEvent, MultiSelectModule } from 'primeng/multiselect';
import { LabelComponent } from '../label/label.component';
import { IdGeneratorService } from '@ombro/shared/util-ui';
import { OnChangeFn, OnTouchedFn } from '../../types';
import { IconName } from '@ombro/shared/ui-icons';

@Component({
  selector: 'ombro-multi-select',
  imports: [LabelComponent, MultiSelectModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiSelectComponent),
      multi: true,
    },
  ],
  templateUrl: './multi-select.component.html',
  styleUrl: './multi-select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiSelectComponent {
  private readonly idGeneratorService = inject(IdGeneratorService);
  private readonly renderer = inject(Renderer2);
  private readonly labelComponent = viewChild(LabelComponent, { read: ElementRef });
  private readonly multiSelectComponent = viewChild<MultiSelect>('multiSelect');

  private deleteForEl = effect(() => {
    const wrapper = this.labelComponent()?.nativeElement;
    if (wrapper) {
      const label = wrapper.querySelector('label');
      if (label) this.renderer.removeAttribute(label, 'for');
    }
  });

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
  protected value = signal<unknown[]>([]);
  protected isDisabled = signal(false);
  protected isLabelHovered = signal<boolean>(false);

  onLabelClick() {
    const multiSelect = this.multiSelectComponent();
    if (multiSelect) {
      multiSelect.show();

      const input = multiSelect.el.nativeElement.querySelector('input');
      input.focus();
    }
  }

  onChange: OnChangeFn<unknown> = () => {
    /* empty */
  };
  onTouched: OnTouchedFn = () => {
    /* empty */
  };

  writeValue(val: unknown[]): void {
    this.value.set(val);
  }
  registerOnChange(fn: OnChangeFn<unknown>): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: OnTouchedFn): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  handleMultiSelectChange(event: MultiSelectChangeEvent): void {
    const newValue = event.value !== undefined ? event.value : event;

    if (this.value() !== newValue) {
      this.value.set(newValue);
      this.onChange(newValue);
    }
  }
}
