import { TestBed } from '@angular/core/testing';
import { BreadcrumbService } from './breadcrumb.service';
import { ReplaySubject } from 'rxjs';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Signal } from '@angular/core';
import { BreadcrumbItem } from './types';

describe('BreadcrumbService', () => {
  let service: BreadcrumbService;
  let routerEvents$: ReplaySubject<unknown>;

  const settingsChild = {
    snapshot: {
      url: [{ path: 'settings' }],
      data: { breadcrumb: 'Settings' },
    },
    firstChild: null,
    children: [],
  };
  const homeChild = {
    snapshot: {
      url: [{ path: 'home' }],
      data: { breadcrumb: 'Home page' },
    },
    firstChild: settingsChild,
    children: [settingsChild],
  };

  const mockActivatedRoute = {
    root: {
      firstChild: homeChild,
      children: [homeChild],
    },
  };

  beforeEach(() => {
    routerEvents$ = new ReplaySubject(1);

    TestBed.configureTestingModule({
      providers: [
        BreadcrumbService,
        {
          provide: Router,
          useValue: { events: routerEvents$.asObservable() },
        },
        {
          provide: ActivatedRoute,
          useValue: mockActivatedRoute,
        },
      ],
    });

    service = TestBed.inject(BreadcrumbService);
  });

  it('should return empty array on initial', () => {
    const breadcrumbs = service.getBreadcrumbs();
    expect(breadcrumbs()).toEqual([]);
  });

  it('should generate breadcrumbs after navigation is complete', async () => {
    const breadcrumbsSignal: Signal<BreadcrumbItem[]> = service.getBreadcrumbs();

    routerEvents$.next(new NavigationEnd(1, '/home/settings', '/home/settings'));

    const result = breadcrumbsSignal();

    expect(result.length).toBe(2);
    expect(result[0]).toEqual({ label: 'Home page', url: '/home' });
    expect(result[1]).toEqual({ label: 'Settings', url: '/home/settings' });
  });

  it('should ignore events other than NavigationEnd', () => {
    const breadcrumbsSignal = service.getBreadcrumbs();

    routerEvents$.next({ id: 1, url: '/test' });

    expect(breadcrumbsSignal()).toEqual([]);
  });
});
