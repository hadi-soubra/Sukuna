import { Component, inject } from '@angular/core';
import { DropStatus } from '../../core/services/drop-status';
import { Teaser } from './teaser/teaser';
import { Upcoming } from './upcoming/upcoming';
import { Live } from './live/live';
import { Ended } from './ended/ended';

@Component({
  selector: 'app-landing',
  imports: [Teaser, Upcoming, Live, Ended],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class Landing {
  protected readonly dropStatus = inject(DropStatus);
}


