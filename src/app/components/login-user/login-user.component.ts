import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login-user',
  imports: [MatInputModule, ReactiveFormsModule],
  templateUrl: './login-user.component.html',
  styleUrl: './login-user.component.scss',
})
export class LoginUserComponent {
  private router = inject(Router);
  private authService = inject(AuthService);

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

    console.log('email', email, 'pasword:', password);

    // Lógica para autenticar al usuario
    this.authService.login(email, password).subscribe({
      next: (response) => {
        console.log('Login exitoso:', response);
        this.router.navigate(['/gastos-lista']);
      },
      error: (error) => {
        console.error('Error en el login:', error);
        this.errorMessage =
          'Credenciales inválidas. Por favor, inténtelo de nuevo.';
      },
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
