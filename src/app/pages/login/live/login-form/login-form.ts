import { Component,DestroyRef, inject, signal, output, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Meta } from '@angular/platform-browser'; 

@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule],
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss',
})
export class LoginForm {
  private readonly destroyRef = inject(DestroyRef);

  private readonly fullHeadline = 'Quickly Before all is gone';
  protected readonly headline = signal('');
  protected readonly typingDone = signal(false);

  private readonly fb = inject(FormBuilder);

  readonly login = output<{ email: string; password: string }>();

  readonly errorMessage = input<string | null>(null);
  readonly loading = input(false);

  readonly clearError = output<void>();

  private readonly meta = inject(Meta);              

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
    this.login.emit({
      email: this.loginForm.value.email ?? '',
      password: this.loginForm.value.password ?? '',
    });
  }
}
