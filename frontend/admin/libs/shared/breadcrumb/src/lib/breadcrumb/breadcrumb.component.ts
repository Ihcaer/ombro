import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
  Signal,
} from '@angular/core';
import { BreadcrumbItem } from './types';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { RouterLink } from '@angular/router';
import { IconComponent } from '@ombro/shared/ui/ui-icons';
import { BreadcrumbService } from './breadcrumb.service';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'ombro-breadcrumb',
  imports: [BreadcrumbModule, RouterLink, IconComponent, NgTemplateOutlet],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbComponent {
  private readonly service = inject(BreadcrumbService);

  homeUrl = input<string>('/');
  separatorItem = input<string>('/');

  items: Signal<BreadcrumbItem[]> = this.service.getBreadcrumbs();

  protected navAriaLabel = signal<string>('Ścieżka nawigacji');

  private homeItem: BreadcrumbItem = { label: 'home', url: this.homeUrl(), id: 'home' };

  protected references = computed<BreadcrumbItem[]>(() => {
    const allItems = [this.homeItem, ...this.items()];

    if (allItems.length === 0) return allItems;

    return allItems.with(-1, { ...allItems[allItems.length - 1], current: true });
  });
}
