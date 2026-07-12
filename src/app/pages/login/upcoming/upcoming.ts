import { Component, signal } from '@angular/core';
import { Intro } from './intro/intro';
import { ApplyForm } from './apply-form/apply-form';
import { Confirmation } from './confirmation/confirmation';

@Component({
  selector: 'app-upcoming',
  imports: [Intro, ApplyForm, Confirmation],
  templateUrl: './upcoming.html',
  styleUrl: './upcoming.scss',
})
export class Upcoming {
  protected readonly step = signal<StepType>('intro');
  protected readonly applicantName = signal('');

  protected onSubmitted(name: string): void {
    this.applicantName.set(name);
    this.step.set('confirmation');
  }

}

type StepType = 'intro' | 'apply' | 'confirmation';
