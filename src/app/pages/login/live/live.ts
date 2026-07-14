import { Component, signal, inject } from '@angular/core';
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

  protected onLogin(payload: { email: string; password: string }): void {
    this.auth.authenticate(payload.email, payload.password).subscribe({
      next: () => {
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('login failed', err);
      },
    });
  }

}
type StepType = 'intro' | 'login';
