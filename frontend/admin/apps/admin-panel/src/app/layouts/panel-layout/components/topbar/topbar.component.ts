import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AvatarPopoverComponent } from './components/avatar-popover/avatar-popover.component';

@Component({
  selector: 'app-panel-topbar',
  imports: [AvatarPopoverComponent],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopbarComponent {}
