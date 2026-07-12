import { Component,DestroyRef, inject, signal, output } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule],
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss',
})
export class LoginForm {
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  private readonly fullHeadline = 'Quickly Before all is gone';
  protected readonly headline = signal('');
  protected readonly typingDone = signal(false);

  private readonly fb = inject(FormBuilder);

  readonly login = output<void>();

  constructor() {
  if (window.innerWidth > 600) {
    this.document.documentElement.classList.add('no-scroll');
    this.document.body.classList.add('no-scroll');
  }

  this.destroyRef.onDestroy(() => {
    this.document.documentElement.classList.remove('no-scroll');
    this.document.body.classList.remove('no-scroll');
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

  protected onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }
    this.login.emit()
  }
}
