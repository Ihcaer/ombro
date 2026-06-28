import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { IconName, IconComponent } from '@ombro/shared/ui-icons';
import { RouterLink } from '@angular/router';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-profile-menu',
  imports: [RouterLink, IconComponent, NgTemplateOutlet],
  templateUrl: './profile-menu.component.html',
  styleUrl: './profile-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileMenuComponent {
  displayName = input.required<string>();
  handleName = input.required<string>();
  logoutButtonClicked = output<void>();

  protected ariaLabel = signal<string>('Menu profilu');

  protected navItems: { name: string; icon: IconName; path?: string; action?: () => void }[] = [
    { name: 'Wyloguj', icon: 'logout', action: () => this.handleLogoutButtonClick() },
  ];

  private handleLogoutButtonClick(): void {
    this.logoutButtonClicked.emit();
  }
}
