import { Component,DestroyRef, inject, signal, output } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Meta } from '@angular/platform-browser'; 

function passwordMatch(group: AbstractControl) { 
  const password = group.get('password')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;
  return password===confirmPassword ? null : { passwordMismatch: true };
}

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

  readonly submitted = output<{ firstName: string; lastName: string; email: string; password: string; dateOfBirth: string }>();

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

  protected readonly applyForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    dateOfBirth: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required],
    agree: [false, Validators.requiredTrue],
  }, { validators: passwordMatch });

  protected onSubmit(): void {
    if (this.applyForm.invalid) {
      return;
    }
    console.log(this.applyForm.value);
    this.submitted.emit({
      firstName: this.applyForm.value.firstName ?? '',
      lastName: this.applyForm.value.lastName ?? '',
      email: this.applyForm.value.email ?? '',
      dateOfBirth: this.applyForm.value.dateOfBirth ?? '',
      password: this.applyForm.value.password ?? '',
    });
  }
}
