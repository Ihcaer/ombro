import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AuthStore } from '@ombro/admin-auth';
import { UserStore } from '@ombro/admin-user';
import { AvatarComponent } from '@ombro/shared/ui/ui-primitives';
import { ProfileMenuComponent } from '../profile-menu/profile-menu.component';
import { translateSignal } from '@jsverse/transloco';

@Component({
  selector: 'app-avatar-popover',
  imports: [AvatarComponent, ProfileMenuComponent],
  templateUrl: './avatar-popover.component.html',
  styleUrl: './avatar-popover.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarPopoverComponent {
  protected readonly authStore = inject(AuthStore);
  protected readonly userStore = inject(UserStore);

  protected avatarSize = signal<string>('');

  ngOnInit(): void {
    this.setAvatarSize();
  }

  protected buttonAriaLabel = translateSignal('misc.profile.label', {
    name: this.userStore.displayName(),
  });

  private setAvatarSize(): void {
    const sizeVariable = '--p-custom-primitive-font-size-32';

    const rootStyles = getComputedStyle(document.documentElement);
    const size = rootStyles.getPropertyValue(sizeVariable).trim();
    this.avatarSize.set(size);
  }
}
