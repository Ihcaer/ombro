import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { IconName, isMaterialIcon } from './icons.list';
import {
  AvailableFill,
  AvailableGrade,
  AvailableSize,
  AvailableWeight,
  iconProperties,
} from './icons.properties';

@Component({
  selector: 'ui-icon',
  imports: [],
  templateUrl: './icons.html',
  styleUrl: './icons.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Icons {
  name = input.required<IconName>();
  size = input<AvailableSize>(iconProperties.size[0]);
  weight = input<AvailableWeight>(iconProperties.weight[0]);
  fill = input<AvailableFill>(!!iconProperties.fill[0]);
  grade = input<AvailableGrade>(iconProperties.grade[0]);

  isMaterial = computed(() => isMaterialIcon(this.name() as string));

  fontSettings = computed(() => {
    const w = this.weight();
    const f = this.fill() ? 1 : 0;
    const s = this.size();
    const g = this.grade();
    return `'wght' ${w}, 'FILL' ${f}, 'GRAD' ${g}, 'opsz' ${s}`;
  });

  customIconPath = computed(() => {
    return `assets/icons/${this.name()}.svg`;
  });
}
