import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'ombro-primitive-avatar',
  imports: [SkeletonModule],
  templateUrl: './avatar.component.html',
  styles: `
    :host {
      display: flex;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarComponent {
  imageUrl = input.required<string | null>();
  name = input.required<string | null>();
  size = input<string>('1.5rem');

  protected imageFetchFailed = signal<boolean>(false);

  protected showImage = computed<boolean>(() => !!this.imageUrl() && !this.imageFetchFailed());
  protected isDataLoaded = computed<boolean>(() => !!this.name());

  protected initials = computed<string | null>(() => {
    const rawName = this.name();
    if (!rawName) return null;

    const name = rawName.trim();

    const parts = name.split(/\s+/);
    if (parts.length > 1) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    } else {
      return name.slice(0, 2).toUpperCase();
    }
  });

  protected backgroundColor = computed<string | 'transparent'>(() => {
    const name = this.name();
    if (!name) return 'transparent';

    let hash = 0;
    for (const char of name!) {
      const codePoint: number = char.codePointAt(0) ?? 0;
      hash = codePoint + ((hash << 5) - hash);
    }

    const h = Math.abs(hash % 360);
    return `hsl(${h}, 65%, 45%)`;
  });

  protected computedSize = computed(() => {
    const rawValue = this.size();

    const match = rawValue.match(/^([\d.]+)([a-zA-Z%]+)$/);
    if (match) {
      return rawValue;
    } else {
      return rawValue + 'px';
    }
  });

  protected computedFontSize = computed<string>(() => {
    const rawValue = this.size();

    const match = rawValue.match(/^([\d.]+)([a-zA-Z%]+)$/);

    const num = match ? parseFloat(match[1]) : Number(rawValue);
    const unit = match ? match[2] : 'px';
    const factor = 0.4;

    return num * factor + unit;
  });
}
