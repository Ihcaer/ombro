import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { IconComponent, IconName } from '@ombro/shared/ui/ui-icons';
import { ButtonSeverity } from 'primeng/button';
import { AppendTo } from 'primeng/types/shared';

type DialogWidthStyles = { width?: string; 'max-width'?: string };

@Component({
  selector: 'ombro-primitive-dialog',
  imports: [DialogModule, IconComponent],
  templateUrl: './dialog.component.html',
  styles: `
    ::ng-deep .p-dialog-header {
      color: var(--p-dialog-additional-title-color);
      font-size: var(--p-dialog-title-font-size);
    }
    ::ng-deep .p-dialog {
      margin: var(--p-dialog-additional-margin);
      backdrop-filter: blur(var(--p-dialog-additional-backdrop-blur));
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogComponent {
  isVisible = model.required<boolean>();

  headerIcon = input<IconName | null>(null);
  severity = input<ButtonSeverity | null>(null);
  modal = input<boolean>(true);
  dissmisableMask = input<boolean>(true);
  closable = input<boolean>(true);
  closeOnEscape = input<boolean>(true);
  draggable = input<boolean>(true);
  focusOnShow = input<boolean>(false);
  blockScroll = input<boolean>(false);
  appendTo = input<AppendTo>('body');
  maxWidth = input<string>('none');

  onHide = output<void>();

  closeAriaLabel = signal('Zamknij');

  protected dialogWidth = computed<DialogWidthStyles>(() => {
    const maxWidth = this.maxWidth();
    if (!maxWidth || maxWidth === 'none' || maxWidth === 'unset') return { 'max-width': maxWidth };

    return { 'max-width': maxWidth, width: '100%' };
  });
}
