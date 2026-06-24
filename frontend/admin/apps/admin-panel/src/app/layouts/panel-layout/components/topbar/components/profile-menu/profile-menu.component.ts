import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { IconName, IconComponent } from '@ombro/shared/ui-icons';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile-menu',
  imports: [RouterLink, IconComponent],
  templateUrl: './profile-menu.component.html',
  styleUrl: './profile-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileMenuComponent {
  displayName = input.required<string>();
  handleName = input.required<string>();

  protected ariaLabel = signal<string>('Menu profilu');

  protected navItems: { name: string; path: string; icon?: IconName }[] = [];
}
