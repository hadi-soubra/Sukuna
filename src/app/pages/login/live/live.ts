import { Component, signal } from '@angular/core';
import { Intro } from './intro/intro';
import { LoginForm } from './login-form/login-form';

@Component({
  selector: 'app-live',
  imports: [Intro,LoginForm],
  templateUrl: './live.html',
  styleUrl: './live.scss',
})
export class Live {
  protected readonly step = signal<StepType>('intro');
  protected readonly applicantName = signal('');

}
type StepType = 'intro' | 'login';
