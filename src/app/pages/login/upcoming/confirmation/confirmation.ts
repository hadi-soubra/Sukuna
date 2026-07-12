import { Component, inject,signal,DestroyRef, input } from '@angular/core';
import { DOCUMENT } from '@angular/common';


@Component({
  selector: 'app-confirmation',
  imports: [],
  templateUrl: './confirmation.html',
  styleUrls: ['./confirmation.scss','../../login.scss']
})
export class Confirmation {
  
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  private readonly fullHeadline = 'Application received';
  protected readonly headline = signal('');
  protected readonly typingDone = signal(false);
  
  constructor() {
      this.document.body.classList.add('no-scroll');
      this.destroyRef.onDestroy(() => {
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
  readonly applicantName = input.required<string>();

}
