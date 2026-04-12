import { provideAppInitializer } from '@angular/core';
import { MATERIAL_ICONS } from './icons.list';
import { iconProperties } from './icons.properties';

const getMinMaxAsAxe = (
  numbers:
    | typeof iconProperties.size
    | typeof iconProperties.weight
    | typeof iconProperties.fill
    | typeof iconProperties.grade
): string => {
  if ((numbers.length as number) === 0) throw new Error('Table cannot be null');

  if (numbers.length === 1) return String(numbers[0]);

  const min = Math.min(...numbers);
  const max = Math.max(...numbers);

  return `${min}..${max}`;
};

export function provideMaterialSymbols() {
  return provideAppInitializer(() => {
    if (typeof document === 'undefined') return;

    const size: string = getMinMaxAsAxe(iconProperties.size);
    const weight: string = getMinMaxAsAxe(iconProperties.weight);
    const fill: string = getMinMaxAsAxe(iconProperties.fill);
    const grade: string = getMinMaxAsAxe(iconProperties.grade);

    const axes = `opsz,wght,FILL,GRAD@${size},${weight},${fill},${grade}`;
    const iconList = MATERIAL_ICONS.join('');

    const url = `https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:${axes}&text=${iconList}`;

    if (!document.querySelector(`link[href="${url}]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;
      document.head.appendChild(link);
    }
  });
}
