import { Component, signal, inject } from '@angular/core';
import { Intro } from './intro/intro';
import { LoginForm } from './login-form/login-form';
import { Router } from '@angular/router';

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


  protected onLogin(): void{
    this.router.navigate(['/home']);
  }

}
type StepType = 'intro' | 'login';
