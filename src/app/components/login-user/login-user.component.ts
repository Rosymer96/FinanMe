import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from "@angular/material/input";

@Component({
  selector: 'app-login-user',
  imports: [MatInputModule, ReactiveFormsModule],
  templateUrl: './login-user.component.html',
  styleUrl: './login-user.component.scss',
})
export class LoginUserComponent {
  errorMessage: string = '';
  messageResponse: string = '';

  public form = new FormGroup({
    email: new FormControl<string | null>(null, [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl<string | null>(null, [Validators.required]),
  });

  onLogin(){

  }
}
