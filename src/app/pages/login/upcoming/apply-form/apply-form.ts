import { Component,DestroyRef, inject, signal, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-apply-form',
  imports: [ReactiveFormsModule],
  templateUrl: './apply-form.html',
  styleUrl: './apply-form.scss',
})
export class ApplyForm {

  private readonly destroyRef = inject(DestroyRef);

  private readonly fullHeadline = 'Not everyone gets in';
  protected readonly headline = signal('');
  protected readonly typingDone = signal(false);

  private readonly fb = inject(FormBuilder);

  readonly submitted = output<string>();

constructor() {
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

  protected readonly applyForm = this.fb.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required],
    agree: [false, Validators.requiredTrue],
  });

  protected onSubmit(): void {
    if (this.applyForm.invalid) {
      return;
    }
    console.log(this.applyForm.value);
    this.submitted.emit(this.applyForm.value.fullName ?? '');
  }

  
}
