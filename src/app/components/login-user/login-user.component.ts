import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-user',
  imports: [MatInputModule, ReactiveFormsModule],
  templateUrl: './login-user.component.html',
  styleUrl: './login-user.component.scss',
})
export class LoginUserComponent {
  router = inject(Router);

  errorMessage: string = '';
  messageResponse: string = '';

  public form = new FormGroup({
    email: new FormControl<string | null>(null, [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl<string | null>(null, [Validators.required]),
  });

  onLogin() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
    }
    const email = this.form.value.email!.trim().toLowerCase();
    const password = this.form.value.password!;
  }
  goToRegister() {
    this.router.navigate(['/register']);
  }
}
