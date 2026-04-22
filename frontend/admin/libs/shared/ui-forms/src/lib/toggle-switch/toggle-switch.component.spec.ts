import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToggleSwitchComponent } from './toggle-switch.component';

describe('ToggleSwitchComponent', () => {
  let component: ToggleSwitchComponent;
  let fixture: ComponentFixture<ToggleSwitchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToggleSwitchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ToggleSwitchComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
