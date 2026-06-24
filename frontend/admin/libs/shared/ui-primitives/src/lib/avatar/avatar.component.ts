import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

@Component({
  selector: 'ombro-primitive-avatar',
  imports: [],
  templateUrl: './avatar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarComponent {
  imageUrl = input.required<string | null>();
  name = input.required<string>();
  size = input<string>('1.5rem');

  protected imageFetchFailed = signal<boolean>(false);

  protected showImage = computed(() => !!this.imageUrl() && !this.imageFetchFailed());

  protected initials = computed(() => {
    const fullName = this.name().trim();

    const parts = fullName.split(/\s+/);
    if (parts.length > 1) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    } else {
      return fullName.slice(0, 2).toUpperCase();
    }
  });

  protected backgroundColor = computed(() => {
    const name = this.name();
    if (name === 'N7')
      return 'linear-gradient(90deg, #1a1a1a 0%, #1a1a1a 55%, #df0101 55%, #df0101 65%, #ffffff 65%, #ffffff 70%, #1a1a1a 70%, #1a1a1a 100%)';

    let hash = 0;
    for (const char of name) {
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
