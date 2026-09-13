import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatepickerComponent } from './datepicker.component';
import { provideDumbTranslocoForTests } from '@ombro/shared/utils/translation-utils';

describe('DatepickerComponent', () => {
  let component: DatepickerComponent;
  let fixture: ComponentFixture<DatepickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatepickerComponent],
      providers: [provideDumbTranslocoForTests()],
    }).compileComponents();

    fixture = TestBed.createComponent(DatepickerComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('value', null);

    await fixture.whenStable();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
