import { inject, Injectable, Signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BreadcrumbItem } from './types';
import { filter, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly breadcrumb = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.createBreadcrumbs(this.route.root)),
    ),
    { initialValue: [] },
  );

  getBreadcrumbs(): Signal<BreadcrumbItem[]> {
    return this.breadcrumb;
  }

  private createBreadcrumbs(
    route: ActivatedRoute,
    url = '',
    breadcrumbs: BreadcrumbItem[] = [],
  ): BreadcrumbItem[] {
    const child = route.firstChild;

    if (!child) return breadcrumbs;

    const routeUrl = child.snapshot.url.map((s) => s.path).join('/');
    const nextUrl = routeUrl ? `${url}/${routeUrl}` : url;
    const label: string = child.snapshot.data['breadcrumb'] ?? nextUrl;

    breadcrumbs.push({ label, url: nextUrl });

    return this.createBreadcrumbs(child, nextUrl, breadcrumbs);
  }
}
