import { Component, inject } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { capitalizeWords } from '../../utils/string-utils';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { ICategory } from '../../Interfaces/category';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';
@Component({
  selector: 'app-register-user',
  imports: [ReactiveFormsModule, MatInputModule],
  templateUrl: './register-user.component.html',
  styleUrl: './register-user.component.scss',
})
export class RegisterUserComponent {
  private userService = inject(UserService);
  private router = inject(Router);

  errorMessage: string = '';
  messageResponse: string = '';

  public form = new FormGroup({
    name: new FormControl<string | null>(null, [
      Validators.required,
      Validators.maxLength(50),
    ]),
    email: new FormControl<string | null>(null, [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl<string | null>(null, [
      Validators.required,
      Validators.minLength(5),
      Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&.]{5,}$/),
    ]),
  });

  onRegister() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
    }

    const name = capitalizeWords(this.form.value.name!);
    const email = this.form.value.email!.trim().toLowerCase();
    const password = this.form.value.password!;

    this.userService.register(name, email, password).subscribe({
      next: (res) => {
        if (res) {
          console.log('Registro existoso:', res.message);
          this.messageResponse = 'La cuenta ha sido creada con exito.';
          this.form.reset();
          this.errorMessage = '';
        }
      },
      error: (err) => {
        console.error('Error en register:', err);
        this.errorMessage =
          err.error?.message || 'No se pudo completar el registro.';
      },
    });
  }
  goToLogin() {
    this.router.navigate(['/']);
  }
}
