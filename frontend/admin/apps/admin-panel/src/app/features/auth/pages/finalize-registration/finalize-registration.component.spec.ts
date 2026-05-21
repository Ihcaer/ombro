import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinalizeRegistrationComponent } from './finalize-registration.component';
import { COMMON_TESTING_PROVIDERS } from '@ombro/admin-panel/app/shared/testing/common-testing-providers';

describe('FinalizeRegistrationComponent', () => {
  let component: FinalizeRegistrationComponent;
  let fixture: ComponentFixture<FinalizeRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinalizeRegistrationComponent],
      providers: [...COMMON_TESTING_PROVIDERS],
    }).compileComponents();

    fixture = TestBed.createComponent(FinalizeRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
