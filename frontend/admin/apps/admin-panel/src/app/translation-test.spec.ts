import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslocoScope, TranslocoDirective, TranslocoScope } from '@jsverse/transloco';
import { getTranslocoTestingModule } from './shared/testing/transloco-testing-module';
import { By } from '@angular/platform-browser';
import en from '../assets/i18n/en.json';
import primeng from '../assets/i18n/primeng/en.json';
import auth from '../assets/i18n/auth/en.json';
import panel from '../assets/i18n/panel/en.json';
import panelDashboard from '../assets/i18n/panel/dashboard/en.json';

type TranslationElement = { path: string; expected: string };

const translocoScopes: TranslocoScope[] = ['primeng', 'auth', 'panel', 'panelDashboard'];
const translationElements: TranslationElement[] = [
  { path: 'common.nav.signInPage', expected: en.common.nav.signInPage },
  { path: 'primeng.passwordPrompt', expected: primeng.passwordPrompt },
  { path: 'auth.signInPage.title', expected: auth.signInPage.title },
  { path: 'panel.actions.signOut', expected: panel.actions.signOut },
  { path: 'panelDashboard.heading.lead', expected: panelDashboard.heading.lead },
];

const translationElementClass = 'translation-element';

@Component({
  standalone: true,
  imports: [TranslocoDirective],
  providers: [provideTranslocoScope(...translocoScopes)],
  template: `
    <div *transloco="let t">
      @for (item of translationItems; track $index) {
        <span [class]="translationClass">{{ t(item.path) }}</span>
      }
    </div>
  `,
})
class TranslationTestComponent {
  protected readonly translationItems: TranslationElement[] = [...translationElements];
  protected readonly translationClass = translationElementClass;
}

describe('TranslationTestComponent', () => {
  let component: TranslationTestComponent;
  let fixture: ComponentFixture<TranslationTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [getTranslocoTestingModule()],
    }).compileComponents();

    fixture = TestBed.createComponent(TranslationTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render the translations correctly', () => {
    const listElements = fixture.debugElement.queryAll(By.css('.' + translationElementClass));

    const renderedText = listElements.map((el) => (el.nativeElement as HTMLElement).textContent);
    const expectedTranslations: string[] = translationElements.map((obj) => obj.expected);

    expect(listElements.length).toBe(translationElements.length);
    expect(renderedText).toEqual(expectedTranslations);
  });
});
