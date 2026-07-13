import { Component, DestroyRef, inject, signal,computed, output } from '@angular/core';


@Component({
  selector: 'app-intro',
  imports: [],
  templateUrl: './intro.html',
  styleUrls: ['./intro.scss', '../../login.scss'],
})
export class Intro {
    private readonly destroyRef = inject(DestroyRef);
  
    private readonly fullHeadline = 'New Drop Is Live';
    protected readonly headline = signal('');
    protected readonly typingDone = signal(false);

    protected readonly countdown = signal(1);

    readonly gotologin = output<void>();

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

    const countdownId = setInterval(() => {
      this.countdown.set(0);
    }, 1000);
    this.destroyRef.onDestroy(() => clearInterval(countdownId));
  }
  protected onGOTOLOGIN(): void {
    this.gotologin.emit();
  }
}

