import { Component, signal, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Intro } from './intro/intro';
import { LoginForm } from './login-form/login-form';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service'

@Component({
  selector: 'app-live',
  imports: [Intro,LoginForm],
  templateUrl: './live.html',
  styleUrl: './live.scss',
})
export class Live {
  protected readonly step = signal<StepType>('intro');
  protected readonly applicantName = signal('');

  private readonly router = inject(Router);

  private readonly auth = inject(AuthService);

  protected readonly errorMessage = signal<string | null>(null);
  protected readonly loading = signal(false);

  protected onLogin(payload: { email: string; password: string }): void {
    this.errorMessage.set(null);
    this.loading.set(true);
    this.auth.authenticate(payload.email, payload.password).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/shop']);
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        this.errorMessage.set(
          err.status === 400 || err.status === 401
            ? 'Email or password is incorrect.'
            : 'Something went wrong. Please try again.'
        );
      },
    });
  }

}
type StepType = 'intro' | 'login';
