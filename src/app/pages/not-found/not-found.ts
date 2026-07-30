import { Component, DestroyRef, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  templateUrl: './not-found.html',
  styleUrls: ['../login/upcoming/intro/intro.scss', '../login/login.scss', './not-found.scss'],
})
export class NotFound {
  private readonly destroyRef = inject(DestroyRef);
  private readonly fullHeadline = 'Page Not Found';

  protected readonly headline = signal('');
  protected readonly typingDone = signal(false);

  constructor() {
    let characterCount = 0;
    const typingId = setInterval(() => {
      characterCount++;
      this.headline.set(this.fullHeadline.slice(0, characterCount));

      if (characterCount >= this.fullHeadline.length) {
        clearInterval(typingId);
        this.typingDone.set(true);
      }
    }, 80);

    this.destroyRef.onDestroy(() => clearInterval(typingId));
  }
}
