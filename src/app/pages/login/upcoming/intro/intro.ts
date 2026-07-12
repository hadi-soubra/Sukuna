import { Component, DestroyRef, inject, signal,computed, output } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { DropStatus } from '../../../../shared/services/drop-status';


@Component({
  selector: 'app-intro',
  imports: [],
  templateUrl: './intro.html',
  styleUrls: ['./intro.scss', '../../login.scss'],
})
export class Intro {

  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dropStatus = inject(DropStatus);

  private readonly fullHeadline = 'Coming Soon';
  protected readonly headline = signal('');
  protected readonly typingDone = signal(false);

  readonly apply = output<void>();

  private readonly remainingMs = signal(this.dropStatus.dropDate().getTime() - Date.now());
  protected readonly days = computed(() => Math.floor(this.remainingMs() / 86_400_000));
  protected readonly hours = computed(() => Math.floor((this.remainingMs() % 86_400_000) / 3_600_000));
  protected readonly minutes = computed(() => Math.floor((this.remainingMs() % 3_600_000) / 60_000));
  protected readonly seconds = computed(() => Math.floor((this.remainingMs() % 60_000) / 1_000));


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

    const countdownId = setInterval(() => {
      this.remainingMs.set(this.dropStatus.dropDate().getTime() - Date.now());
    }, 1000);
    this.destroyRef.onDestroy(() => clearInterval(countdownId));
  }
    protected onApply(): void {
    this.apply.emit();
  }
}
