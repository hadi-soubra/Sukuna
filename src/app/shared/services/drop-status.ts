import { Injectable, effect, signal } from '@angular/core';

export type DropStatusType = 'Teaser' | 'Upcoming' | 'Live' | 'Ended' | '';

const STATUS_KEY = 'sukuna-drop-status';
const DATE_KEY = 'sukuna-drop-date';

function loadStatus(): DropStatusType {
  const valid: DropStatusType[] = ['Teaser', 'Upcoming', 'Live', 'Ended', ''];
  const saved = localStorage.getItem(STATUS_KEY) as DropStatusType | null;
  return saved !== null && valid.includes(saved) ? saved : '';
}

function loadDate(): Date {
  const saved = localStorage.getItem(DATE_KEY);
  return saved ? new Date(saved) : new Date('');
}

@Injectable({ providedIn: 'root' })
export class DropStatus {
  // the admin writes these, the gate reads them
  readonly status = signal<DropStatusType>(loadStatus());
  readonly dropDate = signal<Date>(loadDate());

  constructor() {
    effect(() => localStorage.setItem(STATUS_KEY, this.status()));
    effect(() => {
      const d = this.dropDate();
      if (!isNaN(d.getTime())) localStorage.setItem(DATE_KEY, d.toISOString());
    });

    window.addEventListener('storage', (e) => {
      if (e.key === STATUS_KEY) {
        this.status.set(loadStatus());
      }
      if (e.key === DATE_KEY) {
        const next = loadDate();
        if (next.getTime() !== this.dropDate().getTime()) {
          this.dropDate.set(next);
        }
      }
    });
  }
}
