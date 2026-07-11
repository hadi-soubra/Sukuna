import { Component, inject } from '@angular/core';
import { DropStatus } from '../../shared/services/drop-status';
import { Teaser } from './teaser/teaser';
import { Upcoming } from './upcoming/upcoming';
import { Live } from './live/live';
import { Ended } from './ended/ended';

@Component({
  selector: 'app-login',
  imports: [Teaser, Upcoming, Live, Ended],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  protected readonly dropStatus = inject(DropStatus);
}


