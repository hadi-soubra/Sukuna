import { Component, DestroyRef, inject, signal } from '@angular/core';

@Component({
  selector: 'app-teaser',
  imports: [],
  templateUrl: './teaser.html',
  styleUrls: ['./teaser.scss','../login.scss']
})
export class Teaser {
  private readonly destroyRef = inject(DestroyRef);

  private readonly fullHeadline = 'The Next Drop';
  protected readonly headline = signal('');

  protected readonly typingDone = signal(false);

constructor() {

    let charCount = 0;
    const typingId = setInterval(() => {
      charCount++;
      this.headline.set(this.fullHeadline.slice(0, charCount));

      if (charCount >= this.fullHeadline.length) {
        clearInterval(typingId);
        this.typingDone.set(true);

      }
    }, 80);

    this.destroyRef.onDestroy(() => clearInterval(typingId));
  }
}
