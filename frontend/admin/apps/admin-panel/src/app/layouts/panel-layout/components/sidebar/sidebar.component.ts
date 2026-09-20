import { ChangeDetectionStrategy, Component, computed, inject, model, signal } from '@angular/core';
import { IconComponent } from '@ombro/shared/ui/ui-icons';
import { LogoComponent } from '@ombro/admin-panel/app/shared/components/logo/logo.component';
import { SIDE_MENU_ITEMS, SideMenuItem } from './menu-items';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthStore } from '@ombro/admin-panel/app/core/auth/store';
import { NgTemplateOutlet } from '@angular/common';
import { translateSignal, TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'app-panel-layout-sidebar',
  imports: [
    IconComponent,
    LogoComponent,
    NgTemplateOutlet,
    RouterLink,
    TranslocoDirective,
    RouterLinkActive,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  isCollapsed = model.required<boolean>();

  private readonly authStore = inject(AuthStore);

  protected navAriaLabel = translateSignal('misc.mainNavigationLabel');
  private allMenuItems = signal<SideMenuItem[]>(SIDE_MENU_ITEMS);

  protected readonly menuItems = computed<SideMenuItem[]>(() => {
    const allItems = this.allMenuItems();

    return allItems.filter((item) =>
      this.authStore.hasAppropriatePrivileges(item.neededPrivileges),
    );
  });

  changeMenuStatus(): void {
    this.isCollapsed.update((value) => !value);
  }
}
