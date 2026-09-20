import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { IconName, IconComponent } from '@ombro/shared/ui/ui-icons';
import { RouterLink } from '@angular/router';
import { NgTemplateOutlet } from '@angular/common';
import { translateSignal, TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'app-profile-menu',
  imports: [RouterLink, IconComponent, NgTemplateOutlet, TranslocoDirective],
  templateUrl: './profile-menu.component.html',
  styleUrl: './profile-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileMenuComponent {
  displayName = input.required<string | null>();
  handleName = input.required<string | null>();
  logoutButtonClicked = output<void>();

  protected ariaLabel = translateSignal('misc.profile.menu');

  protected navItems: { name: string; icon: IconName; path?: string; action?: () => void }[] = [
    { name: 'panel.actions.signOut', icon: 'logout', action: () => this.handleLogoutButtonClick() },
  ];

  private handleLogoutButtonClick(): void {
    this.logoutButtonClicked.emit();
  }
}
