import { TestBed } from '@angular/core/testing';
import { BreadcrumbService } from './breadcrumb.service';
import { Subject } from 'rxjs';
import { ActivatedRoute, NavigationEnd, Router, UrlSegment } from '@angular/router';
import { Signal } from '@angular/core';
import { BreadcrumbItem } from './types';

describe('BreadcrumbService', () => {
  let service: BreadcrumbService;
  let mockActivatedRoute: Partial<ActivatedRoute>;
  let routerEvents$: Subject<any>;

  beforeEach(() => {
    routerEvents$ = new Subject();

    const createUrlSegments = (path: string): UrlSegment[] => [
      { path, parameters: {}, toString: () => path } as UrlSegment,
    ];

    mockActivatedRoute = {
      root: {
        firstChild: {
          snapshot: { url: createUrlSegments('home'), data: { breadcrumbLabel: 'Home' } },
          firstChild: {
            snapshot: { url: createUrlSegments('settings'), data: { breadcrumbLabel: 'Settings' } },
            firstChild: null,
          } as any,
        } as any,
      } as any,
    };

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
    expect(result[0]).toEqual({ label: 'Home', url: '/home' });
    expect(result[1]).toEqual({ label: 'Settings', url: '/home/settings' });
  });

  it('should ignore events other than NavigationEnd', () => {
    const breadcrumbsSignal = service.getBreadcrumbs();

    routerEvents$.next({ id: 1, url: '/test' });

    expect(breadcrumbsSignal()).toEqual([]);
  });
});
