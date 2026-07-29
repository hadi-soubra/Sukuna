import { Component, DestroyRef, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Meta } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-admin-login',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.scss',
})
export class AdminLogin {
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(FormBuilder);
  private readonly meta = inject(Meta);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);

  private readonly fullHeadline = 'Welcome back Hadi';
  protected readonly headline = signal('');
  protected readonly typingDone = signal(false);

  protected readonly errorMessage = signal<string | null>(null);
  protected readonly loading = signal(false);

  constructor() {
    this.meta.updateTag({
      name: 'viewport',
      content: 'width=device-width, initial-scale=1, maximum-scale=1',
    });
    this.destroyRef.onDestroy(() => {
      this.meta.updateTag({
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      });
    });

    let charCount = 0;
    const typingId = setInterval(() => {
      charCount++;
      this.headline.set(this.fullHeadline.slice(0, charCount));
      if (charCount >= this.fullHeadline.length) {
        clearInterval(typingId);
        this.typingDone.set(true);
      }
    }, 80);
    this.destroyRef.onDestroy(() => clearInterval(typingId));
  }

  protected readonly loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  protected onLogin(): void {
    if (this.loginForm.invalid) {
      return;
    }
    this.errorMessage.set(null);
    this.loading.set(true);
    this.auth
      .authenticate(
        this.loginForm.value.email ?? '',
        this.loginForm.value.password ?? ''
      )
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/admin']);
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

  protected clearError(): void {
    this.errorMessage.set(null);
  }
}
