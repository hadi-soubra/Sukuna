import { Component, DestroyRef, inject, input, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { CartStore } from '../../../shared/services/cart.store';

@Component({
  selector: 'app-status-bar',
  imports: [],
  templateUrl: './status-bar.html',
  styleUrl: './status-bar.scss',
})
export class StatusBar {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly cart = inject(CartStore);

  // red box — vim-style mode; pages can override, e.g. 'NORMAL' / 'INSERT'
  readonly mode = input('SUDO');
  // optional center context text, e.g. '20 products · all'
  readonly info = input('');

  protected readonly path = signal(this.toPath(this.router.url));
  protected readonly clock = signal(this.now());

  constructor() {
    // keep the shown path in sync with the current route
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((e) => this.path.set(this.toPath(e.urlAfterRedirects)));

    // live clock — ticks every second
    const clockId = setInterval(() => this.clock.set(this.now()), 1000);
    this.destroyRef.onDestroy(() => clearInterval(clockId));
  }

  private toPath(url: string): string {
    const clean = url.split('?')[0].split('#')[0];
    return '~/sukuna' + (clean === '/' ? '' : clean);
  }

  private now(): string {
    return new Date().toLocaleTimeString('en-GB'); // 24h HH:MM:SS
  }
}
