import { CurrencyPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { StatusBar } from '../../core/layout/status-bar/status-bar';
import { CartStore } from '../../shared/services/cart.store';
import { CheckoutOrderSummary } from './checkout-order-summary';

interface Confirmation {
  items: number;
  total: number;
}

@Component({
  selector: 'app-checkout',
  imports: [StatusBar, RouterLink, CurrencyPipe, ReactiveFormsModule, CheckoutOrderSummary],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
})
export class Checkout {
  private readonly formBuilder = inject(FormBuilder);

  protected readonly cart = inject(CartStore);
  protected readonly confirmation = signal<Confirmation | null>(null);

  protected readonly checkoutForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    country: ['', Validators.required],
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    address: ['', [Validators.required, Validators.minLength(5)]],
    apartment: [''],
    city: ['', Validators.required],
    postalCode: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9 -]{3,10}$/)]],
    cardNumber: ['', [Validators.required, Validators.pattern(/^(?:\d[ -]*?){13,19}$/)]],
    expiry: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
    cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
    cardholder: ['', [Validators.required, Validators.minLength(2)]],
  });

  protected controlInvalid(control: keyof typeof this.checkoutForm.controls): boolean {
    const field = this.checkoutForm.controls[control];
    return field.invalid && field.touched;
  }

  protected formatCardNumber(event: Event): void {
    const input = event.target as HTMLInputElement;
    const formatted = input.value
      .replace(/\D/g, '')
      .slice(0, 19)
      .replace(/(\d{4})(?=\d)/g, '$1 ');

    this.checkoutForm.controls.cardNumber.setValue(formatted);
  }

  protected formatExpiry(event: Event): void {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '').slice(0, 4);
    const formatted = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;

    this.checkoutForm.controls.expiry.setValue(formatted);
  }

  protected confirmOrder(): void {
    this.checkoutForm.markAllAsTouched();

    if (this.checkoutForm.invalid) {
      requestAnimationFrame(() => {
        document.querySelector<HTMLInputElement>('input.invalid')?.focus();
      });
      return;
    }

    this.confirmation.set({
      items: this.cart.count(),
      total: this.cart.grandTotal(),
    });
    this.cart.clear();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
