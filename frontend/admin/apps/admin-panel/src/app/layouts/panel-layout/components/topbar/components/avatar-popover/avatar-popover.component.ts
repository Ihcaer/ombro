import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { AuthStore } from '@ombro/admin-panel/app/core/auth/store';
import { AvatarComponent } from '@ombro/shared/ui/ui-primitives';
import { ProfileMenuComponent } from '../profile-menu/profile-menu.component';

@Component({
  selector: 'app-avatar-popover',
  imports: [AvatarComponent, ProfileMenuComponent],
  templateUrl: './avatar-popover.component.html',
  styleUrl: './avatar-popover.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarPopoverComponent {
  protected readonly authStore = inject(AuthStore);

  protected avatarSize = signal<string>('');

  ngOnInit(): void {
    this.setAvatarSize();
  }

  protected buttonAriaLabel = computed<string | null>(() => {
    const prefix = 'Profil';
    const name = this.authStore.admin()?.displayName;

    if (!name) {
      return null;
    } else {
      return `${prefix}: ${name}`;
    }
  });

  private setAvatarSize(): void {
    const sizeVariable = '--p-size-32';

    const rootStyles = getComputedStyle(document.documentElement);
    const size = rootStyles.getPropertyValue(sizeVariable).trim();
    this.avatarSize.set(size);
  }
}
