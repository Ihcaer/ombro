import { TestBed } from '@angular/core/testing';
import { TranslocoRootScopeService } from './transloco-root-scope.service';
import { provideDumbTranslocoForTests } from '../testing-utils/provide-dumb-transloco-for-tests';

describe('TranslocoRootScopeService', () => {
  let service: TranslocoRootScopeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TranslocoRootScopeService, provideDumbTranslocoForTests()],
    });
    service = TestBed.inject(TranslocoRootScopeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
