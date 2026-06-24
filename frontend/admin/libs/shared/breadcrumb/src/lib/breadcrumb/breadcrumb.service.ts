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

    const labelDataName = 'breadcrumbLabel';

    const routeUrl = child.snapshot.url.map((s) => s.path).join('/');
    if (!routeUrl && !child.snapshot.data[labelDataName]) {
      return this.createBreadcrumbs(child, url, breadcrumbs);
    }

    const nextUrl = routeUrl ? `${url}/${routeUrl}` : url;

    const fallbackLabel = nextUrl.replace(/^\//, '');
    const label: string = child.snapshot.data[labelDataName] ?? fallbackLabel;

    const updatedBreadcrumbs = [...breadcrumbs, { label, url: nextUrl }];

    return this.createBreadcrumbs(child, nextUrl, updatedBreadcrumbs);
  }
}
