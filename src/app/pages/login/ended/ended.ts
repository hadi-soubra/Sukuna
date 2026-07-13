import { Component, DestroyRef, inject, signal } from '@angular/core';

@Component({
  selector: 'app-ended',
  imports: [],
  templateUrl: './ended.html',
  styleUrls: ['./ended.scss','../login.scss']
})
export class Ended {
  private readonly destroyRef = inject(DestroyRef);

  private readonly fullHeadline = 'Drop Has Ended';
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
