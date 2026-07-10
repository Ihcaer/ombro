import { ChangeDetectionStrategy, Component, input, model, output, signal } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { IconComponent, IconName } from '@ombro/shared/ui/ui-icons';
import { ButtonSeverity } from 'primeng/button';

@Component({
  selector: 'ombro-primitive-dialog',
  imports: [DialogModule, IconComponent],
  templateUrl: './dialog.component.html',
  styles: `
    ::ng-deep .p-dialog-header {
      color: var(--p-dialog-additional-title-color);
      font-size: var(--p-dialog-title-font-size);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogComponent {
  isVisible = model.required<boolean>();

  headerIcon = input<IconName | null>(null);
  severity = input<ButtonSeverity | null>(null);
  modal = input<boolean>(true);
  closable = input<boolean>(true);
  closeOnEscape = input<boolean>(true);
  draggable = input<boolean>(true);
  focusOnShow = input<boolean>(false);
  blockScroll = input<boolean>(false);
  appendTo = input<string>('body');

  onHide = output<void>();

  closeAriaLabel = signal('Zamknij');
}
