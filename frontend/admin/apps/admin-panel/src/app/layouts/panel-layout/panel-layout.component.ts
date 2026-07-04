import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { TopbarComponent } from './components/topbar/topbar.component';
import { BreadcrumbComponent } from '@ombro/shared/breadcrumb';
import { AuthStore, loginPagePath } from '../../core/auth/store';
import { SessionExpiredModalComponent } from './components/dialogs/session-expired-modal/session-expired-modal.component';

@Component({
  selector: 'app-panel-layout',
  imports: [
    RouterOutlet,
    SidebarComponent,
    TopbarComponent,
    BreadcrumbComponent,
    SessionExpiredModalComponent,
  ],
  templateUrl: './panel-layout.component.html',
  styleUrl: './panel-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PanelLayoutComponent {
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  protected isSideMenuCollapsed = signal<boolean>(true);
  protected isDialogOpen = signal<boolean>(false);

  private isDesktop = toSignal(
    this.breakpointObserver
      .observe([Breakpoints.WebLandscape])
      .pipe(map((result) => result.matches)),
    { initialValue: false },
  );

  private _updateMenuCollapse = effect(() => this.isSideMenuCollapsed.set(!this.isDesktop()));
  private _handleDialogState = effect(() => {
    const internalError = this.authStore.lastInternalError();
    if (internalError === 'SESSION_REFRESH_FAILED') {
      this.isDialogOpen.set(true);
    } else {
      this.isDialogOpen.set(false);
    }
  });
  private _handleDialogAutoClosing = effect((onCleanUp) => {
    if (this.isDialogOpen()) {
      const timerId = setTimeout(() => this.onDialogClose(), 60000);
    }
  });

  protected onDialogClose(): void {
    this.authStore.clearInternalError();
    if (this.isDialogOpen()) this.isDialogOpen.set(false);
    this.router.navigateByUrl(loginPagePath);
  }
}
