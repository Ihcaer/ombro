import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinalizeRegistrationComponent } from './finalize-registration.component';
import { COMMON_TESTING_PROVIDERS } from '@ombro/admin-panel/app/shared/testing/common-testing-providers';
import { AuthStore } from '@ombro/admin-panel/app/core/auth/store';
import { signal } from '@angular/core';

describe('FinalizeRegistrationComponent', () => {
  let component: FinalizeRegistrationComponent;
  let fixture: ComponentFixture<FinalizeRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinalizeRegistrationComponent],
      providers: [
        ...COMMON_TESTING_PROVIDERS,
        { provider: AuthStore, useValue: { isLoading: signal<boolean>(false) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinalizeRegistrationComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
