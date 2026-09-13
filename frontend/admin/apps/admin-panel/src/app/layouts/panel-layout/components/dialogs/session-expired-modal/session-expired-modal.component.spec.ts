import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SessionExpiredModalComponent } from './session-expired-modal.component';
import { getTranslocoTestingModule } from '@ombro/admin-panel/app/shared/testing/transloco-testing-module';

describe('SessionExpiredModalComponent', () => {
  let component: SessionExpiredModalComponent;
  let fixture: ComponentFixture<SessionExpiredModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionExpiredModalComponent, getTranslocoTestingModule()],
    }).compileComponents();

    fixture = TestBed.createComponent(SessionExpiredModalComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('isVisible', false);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
