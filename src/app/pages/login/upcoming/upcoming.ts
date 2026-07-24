import { Component, signal,inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
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

  protected readonly errorMessage = signal<string | null>(null);
  protected readonly loading = signal(false);

protected onSubmitted(payload: { firstName: string; lastName: string; email: string; password: string; dateOfBirth: string }): void {
  this.errorMessage.set(null);
  this.loading.set(true);
  this.auth.register(payload).subscribe({
    next: () => {
      this.loading.set(false);
      this.applicantName.set(payload.firstName);
      this.step.set('confirmation');
    },
    error: (err: HttpErrorResponse) => {
      this.loading.set(false);
      this.errorMessage.set(
        err.status === 409
          ? 'That email is already registered.'
          : 'Something went wrong. Please try again.'
      );
    },
  });
}


}

type StepType = 'intro' | 'apply' | 'confirmation';
