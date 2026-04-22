import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectComponent } from './select.component';
import { IdGeneratorService } from '@ombro/shared/util-ui';

describe('SelectComponent', () => {
  let component: SelectComponent;
  let fixture: ComponentFixture<SelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectComponent],
      providers: [
        {
          provide: IdGeneratorService,
          useValue: { generate: (prefix: string) => `${prefix}-123` },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectComponent);
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
