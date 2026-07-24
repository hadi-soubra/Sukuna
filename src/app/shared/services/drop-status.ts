import { Service } from '@angular/core';
import { signal } from '@angular/core';


@Service()
export class DropStatus {
    readonly status = signal<DropStatusType>('Upcoming');
    readonly dropDate = signal(new Date('2026-09-01T00:00:00'));
}

type DropStatusType = 'Teaser' | 'Upcoming' | 'Live' | 'Ended';
