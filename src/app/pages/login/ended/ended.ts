import { Component, DestroyRef, inject, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-ended',
  imports: [],
  templateUrl: './ended.html',
  styleUrls: ['./ended.scss','../login.scss']
})
export class Ended {
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  private readonly fullHeadline = 'Drop Has Ended';
  protected readonly headline = signal('');

  protected readonly typingDone = signal(false);

constructor() {
  this.document.documentElement.classList.add('no-scroll');
  this.document.body.classList.add('no-scroll');
  this.destroyRef.onDestroy(() => {
    this.document.documentElement.classList.remove('no-scroll');
    this.document.body.classList.remove('no-scroll');
  });

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
