import { ChangeDetectionStrategy, Component, computed, inject, model, signal } from '@angular/core';
import { IconComponent } from '@ombro/shared/ui/ui-icons';
import { LogoComponent } from '@ombro/admin-panel/app/shared/components/logo/logo.component';
import { SIDE_MENU_ITEMS, SideMenuItem } from './menu-items';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { AuthStore } from '@ombro/admin-panel/app/core/auth/store';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-panel-layout-sidebar',
  imports: [IconComponent, LogoComponent, NgTemplateOutlet, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  isCollapsed = model.required<boolean>();

  private readonly router = inject(Router);
  private readonly authStore = inject(AuthStore);

  protected navAriaLabel = signal<string>('Nawigacja główna');

  private readonly navigationEndEvent = toSignal(
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)),
    { initialValue: new NavigationEnd(0, this.router.url, this.router.url) },
  );

  private allMenuItems: SideMenuItem[] = SIDE_MENU_ITEMS;

  protected readonly menuItems = computed<SideMenuItem[]>(() => {
    const url = this.navigationEndEvent().urlAfterRedirects;
    const urlTree = this.router.parseUrl(url);

    const urlCategoryIndex: number = 1;
    const categorySegment: string = urlTree.root.children['primary']?.segments.map(
      (segment) => segment.path,
    )[urlCategoryIndex];

    return this.allMenuItems
      .filter((item) => this.authStore.hasAppropriatePrivileges(item.neededPrivileges))
      .map((item) => {
        const url = item.link;
        const itemCategory: string = url.split('/').filter(Boolean)[urlCategoryIndex];
        return {
          ...item,
          isActive: itemCategory === categorySegment && itemCategory !== undefined,
        };
      });
  });

  changeMenuStatus(): void {
    this.isCollapsed.update((value) => !value);
  }
}
