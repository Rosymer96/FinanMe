import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../enviroments/enviroment';
import { IUser, RegisterResponse } from '../../Interfaces/user';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private httpClient = inject(HttpClient);
  private router = inject(Router);

  private API_URL: string = `${environment.API_BASE_URL}/user`;

  private userProfile: IUser | null = null;

  public login(email: string, password: string): Observable<RegisterResponse> {
    return this.httpClient
      .post<RegisterResponse>(`${this.API_URL}/login`, {
        email,
        password,
      })
      .pipe(
        tap((response) => {
          if (response.token && response.user) {
            this.saveUserData(response.token, response.user);
          }
        })
      );
  }

  // Servicio que permita guardar el token y el  user: { id: user.id,  name: user.name, email: user.email    } del usuario en el localStorage
  public saveUserData(token: string, user: IUser): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  // Servicio que realice el logout del usuario, eliminando todo del localStorage
  public logout(): void {
    localStorage.clear();
  }
  //
}
