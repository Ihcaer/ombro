import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AvatarPopoverComponent } from './avatar-popover.component';
import { getTranslocoTestingModule } from '@ombro/admin-panel/app/shared/testing/transloco-testing-module';

describe('AvatarPopoverComponent', () => {
  let component: AvatarPopoverComponent;
  let fixture: ComponentFixture<AvatarPopoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvatarPopoverComponent, getTranslocoTestingModule()],
    }).compileComponents();

    fixture = TestBed.createComponent(AvatarPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
