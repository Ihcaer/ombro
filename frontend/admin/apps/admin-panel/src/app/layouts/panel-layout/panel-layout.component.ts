import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { TopbarComponent } from './components/topbar/topbar.component';
import { BreadcrumbComponent } from '@ombro/shared/breadcrumb';
import { AuthStore, loginPagePath } from '../../core/auth/store';

@Component({
  selector: 'app-panel-layout',
  imports: [RouterOutlet, SidebarComponent, TopbarComponent, BreadcrumbComponent],
  templateUrl: './panel-layout.component.html',
  styleUrl: './panel-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PanelLayoutComponent {
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  protected isSideMenuCollapsed = signal<boolean>(true);

  private isDesktop = toSignal(
    this.breakpointObserver
      .observe([Breakpoints.WebLandscape])
      .pipe(map((result) => result.matches)),
    { initialValue: false },
  );

  private _updateMenuCollapse = effect(() => this.isSideMenuCollapsed.set(!this.isDesktop()));

  // temporary effect
  private _tempModalHandling = effect(() => {
    if (this.displayModal()) {
      alert('You have been logged out.');
      this.authStore.clearInternalError();
      this.router.navigateByUrl(loginPagePath);
    }
  });

  protected displayModal = computed<boolean>(() => {
    const internalError = this.authStore.lastInternalError();
    if (internalError === 'SESSION_REFRESH_FAILED') {
      return true;
    } else {
      return false;
    }
  });
}
