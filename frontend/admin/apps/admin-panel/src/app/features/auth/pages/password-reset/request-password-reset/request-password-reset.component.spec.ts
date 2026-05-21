import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RequestPasswordResetComponent } from './request-password-reset.component';
import { AUTH_PAGE_BASE_TESTING_PROVIDERS } from '../../auth-page-base-testing-providers';
import { COMMON_TESTING_PROVIDERS } from '@ombro/admin-panel/app/shared/testing/common-testing-providers';

describe('RequestResetPasswordComponent', () => {
  let component: RequestPasswordResetComponent;
  let fixture: ComponentFixture<RequestPasswordResetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestPasswordResetComponent],
      providers: [...COMMON_TESTING_PROVIDERS, ...AUTH_PAGE_BASE_TESTING_PROVIDERS],
    }).compileComponents();

    fixture = TestBed.createComponent(RequestPasswordResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
