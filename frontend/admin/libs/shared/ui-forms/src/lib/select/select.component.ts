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
import { LabelComponent } from '../label/label.component';
import { IdGeneratorService } from '@ombro/shared/util-ui';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SelectChangeEvent, SelectModule } from 'primeng/select';
import { OnChangeFn, OnTouchedFn } from '../../types';
import { IconName } from '@ombro/shared/ui-icons';

@Component({
  selector: 'ombro-select',
  imports: [LabelComponent, SelectModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent {
  private idGeneratorService = inject(IdGeneratorService);
  private renderer = inject(Renderer2);
  private labelComponent = viewChild(LabelComponent, { read: ElementRef });

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

  protected labelId = this.idGeneratorService.generate('select-label');
  protected value = signal<unknown>(null);
  protected isDisabled = signal(false);
  protected isLabelHovered = signal<boolean>(false);

  onChange: OnChangeFn<unknown> = () => {
    /* empty */
  };
  onTouched: OnTouchedFn = () => {
    /* empty */
  };

  writeValue(val: unknown): void {
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

  handleSelectChange(event: SelectChangeEvent): void {
    const newValue = event.value !== undefined ? event.value : event;

    if (this.value() !== newValue) {
      this.value.set(newValue);
      this.onChange(newValue);
    }
  }
}
