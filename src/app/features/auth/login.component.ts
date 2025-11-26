import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [ReactiveFormsModule, NgIf],
  styleUrl: './login.component.scss',
  template: `
    <section class="login-shell">
      <div class="login">
        <h2>Sign in</h2>
        <p class="muted">Sign in with any email and password to continue.</p>

        <form [formGroup]="form" (ngSubmit)="submit()">
          <label>
            Email
            <input formControlName="email" type="email" />
          </label>
          <label>
            Password
            <input formControlName="password" type="password" />
          </label>

          <button type="submit">Login</button>
          <p class="error" *ngIf="error">{{ error }}</p>
        </form>
      </div>
    </section>
  `
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected error: string | null = null;

  protected form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password } = this.form.getRawValue();
    const success = this.authService.login(email, password);

    if (success) {
      const redirectTo = this.route.snapshot.queryParamMap.get('redirectTo') ?? '/products';
      this.router.navigateByUrl(redirectTo);
      return;
    }

    this.error = 'Please enter a valid email and password.';
  }
}
