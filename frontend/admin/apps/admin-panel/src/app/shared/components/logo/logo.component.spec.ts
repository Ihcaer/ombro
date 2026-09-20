import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogoComponent } from './logo.component';
import { COMMON_TESTING_PROVIDERS } from '../../testing/common-testing-providers';
import { getTranslocoTestingModule } from '../../testing/transloco-testing-module';

describe('LogoComponent', () => {
  let component: LogoComponent;
  let fixture: ComponentFixture<LogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogoComponent, getTranslocoTestingModule()],
      providers: [...COMMON_TESTING_PROVIDERS],
    }).compileComponents();

    fixture = TestBed.createComponent(LogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
