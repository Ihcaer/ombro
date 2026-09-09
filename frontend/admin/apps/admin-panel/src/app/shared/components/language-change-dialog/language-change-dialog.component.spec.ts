import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LanguageChangeDialogComponent } from './language-change-dialog.component';
import { getTranslocoTestingModule } from '../../testing/transloco-testing-module';

describe('LanguageChangeDialogComponent', () => {
  let component: LanguageChangeDialogComponent;
  let fixture: ComponentFixture<LanguageChangeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LanguageChangeDialogComponent, getTranslocoTestingModule()],
    }).compileComponents();

    fixture = TestBed.createComponent(LanguageChangeDialogComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('isVisible', false);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
