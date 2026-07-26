import { Component, input, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IProduct } from '../../interfaces/IProduct';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard {
  readonly product = input.required<IProduct>();

  // inline transform for the mouse-following 3D tilt
  protected readonly tilt = signal('');
  private readonly maxTilt = 8; // degrees

  protected onTilt(event: MouseEvent): void {
    const el = event.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width; // 0 → 1 across
    const py = (event.clientY - rect.top) / rect.height; // 0 → 1 down
    const rotateY = (px - 0.5) * 2 * this.maxTilt;
    const rotateX = -(py - 0.5) * 2 * this.maxTilt;
    this.tilt.set(`perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
  }

  protected resetTilt(): void {
    this.tilt.set('');
  }
}
