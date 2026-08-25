import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PanelLayoutComponent } from './panel-layout.component';
import { COMMON_TESTING_PROVIDERS } from '../../shared/testing/common-testing-providers';
import { getTranslocoTestingModule } from '../../shared/testing/transloco-testing-module';

describe('PanelLayoutComponent', () => {
  let component: PanelLayoutComponent;
  let fixture: ComponentFixture<PanelLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelLayoutComponent, getTranslocoTestingModule()],
      providers: [...COMMON_TESTING_PROVIDERS],
    }).compileComponents();

    fixture = TestBed.createComponent(PanelLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
