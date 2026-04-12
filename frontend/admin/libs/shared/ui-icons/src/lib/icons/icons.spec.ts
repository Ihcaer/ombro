import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Icons } from './icons';

vi.mock('./icons.list', async (importOriginal) => {
  const original = await importOriginal<typeof import('./icons.list')>();
  return {
    ...original,
    isMaterialIcon: (name: string) => {
      if (name === 'material-test' || name === 'close') return true;
      if (name === 'custom-test' || name === 'my-logo') return false;

      return false;
    },
  };
});

describe('Icons', () => {
  let component: Icons;
  let fixture: ComponentFixture<Icons>;
  let hostElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Icons],
    }).compileComponents();

    fixture = TestBed.createComponent(Icons);
    component = fixture.componentInstance;
    hostElement = fixture.nativeElement;
    fixture.componentRef.setInput('name', 'material-test');
    fixture.detectChanges();
  });

  it('should render Material icon with correct dynamic variation settings', () => {
    fixture.componentRef.setInput('weight', 600);
    fixture.componentRef.setInput('fill', true);
    fixture.componentRef.setInput('size', 24);
    fixture.detectChanges();

    const span = hostElement.querySelector('.material-symbols-outlined') as HTMLSpanElement;

    expect(span).toBeTruthy();
    expect(span.textContent.trim()).toBe('material-test');

    const settings = span.style.fontVariationSettings;

    expect(settings).toContain("'wght' 600");
    expect(settings).toContain("'FILL' 1");
    expect(settings).toContain("'opsz' 24");
    expect(settings).toContain("'GRAD' 0");

    expect(span.style.fontSize).toBe('24px');

    expect(hostElement.querySelector('img')).toBeFalsy();
  });

  it('should render custom SVG as <img> with correct src and dimensions', () => {
    const iconName = 'my-logo';
    const iconSize = 24;

    fixture.componentRef.setInput('name', iconName);
    fixture.componentRef.setInput('size', iconSize);
    fixture.detectChanges();

    const img = hostElement.querySelector('img') as HTMLImageElement;

    expect(img).toBeTruthy();
    expect(hostElement.querySelector('.material-symbols-outlined')).toBeFalsy();

    expect(img.getAttribute('src')).toBe(`assets/icons/${iconName}.svg`);

    expect(img.style.width).toBe(`${iconSize}px`);
    expect(img.style.height).toBe(`${iconSize}px`);
  });

  it('should use default values for size, weight, and fill', () => {
    const span = hostElement.querySelector('.material-symbols-outlined') as HTMLSpanElement;

    expect(span).toBeTruthy();

    const settings = span.style.fontVariationSettings;

    expect(span.style.fontSize).toBe('20px');
    expect(settings).toContain("'wght' 400");
    expect(settings).toContain("'FILL' 0");
    expect(settings).toContain("'opsz' 20");
  });
});
