import { ChangeDetectionStrategy, Component, model, output, signal } from '@angular/core';
import { ButtonModule, ButtonSeverity } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DialogComponent } from '@ombro/shared/ui/ui-primitives';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'app-panel-session-expired-modal',
  imports: [DialogModule, ButtonModule, DialogComponent, TranslocoDirective],
  templateUrl: './session-expired-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionExpiredModalComponent {
  isVisible = model.required<boolean>();
  onClose = output<void>();

  protected severity = signal<ButtonSeverity>('primary');

  protected close(): void {
    this.onClose.emit();
  }
}
