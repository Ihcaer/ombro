import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'app-panel-layout',
  imports: [RouterOutlet, SidebarComponent],
  templateUrl: './panel-layout.component.html',
  styleUrl: './panel-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PanelLayoutComponent {
  private readonly breakpointObserver = inject(BreakpointObserver);

  protected isSideMenuCollapsed = signal<boolean>(true);
  private isDesktop = toSignal(
    this.breakpointObserver
      .observe([Breakpoints.WebLandscape])
      .pipe(map((result) => result.matches)),
    { initialValue: false },
  );

  constructor() {
    effect(() => this.isSideMenuCollapsed.set(!this.isDesktop()));
  }
}
