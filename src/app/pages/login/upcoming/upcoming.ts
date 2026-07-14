import { Component, signal,inject } from '@angular/core';
import { Intro } from './intro/intro';
import { ApplyForm } from './apply-form/apply-form';
import { Confirmation } from './confirmation/confirmation';
import { AuthService } from '../../../core/auth/auth.service'

@Component({
  selector: 'app-upcoming',
  imports: [Intro, ApplyForm, Confirmation],
  templateUrl: './upcoming.html',
  styleUrl: './upcoming.scss',
})
export class Upcoming {
  protected readonly step = signal<StepType>('intro');
  protected readonly applicantName = signal('');

  private readonly auth = inject(AuthService);

protected onSubmitted(payload: { firstName: string; lastName: string; email: string; password: string; dateOfBirth: string }): void {
  this.auth.register(payload).subscribe({
    next: () => {
      this.applicantName.set(payload.firstName);
      this.step.set('confirmation');
    },
    error: (err) => {
      console.error('registration failed', err);
      // we'll show a real message later
    },
  });
}


}

type StepType = 'intro' | 'apply' | 'confirmation';
