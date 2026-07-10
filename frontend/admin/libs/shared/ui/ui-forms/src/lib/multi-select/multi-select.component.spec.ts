import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MultiSelectComponent } from './multi-select.component';

describe('MultiSelectComponent', () => {
  let component: MultiSelectComponent;
  let fixture: ComponentFixture<MultiSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiSelectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MultiSelectComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    fixture.componentRef.setInput('options', [
      { label: 'Option 1', value: 1 },
      { label: 'Option 2', value: 2 },
    ]);

    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
