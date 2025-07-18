import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../enviroments/enviroment';
import { Observable } from 'rxjs';
import { RegisterResponse } from '../../Interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private httpClient = inject(HttpClient);

  private API_URL: string = `${environment.API_BASE_URL}/user`;

  public register(
    name: string,
    email: string,
    password: string
  ): Observable<RegisterResponse> {
    return this.httpClient.post<RegisterResponse>(`${this.API_URL}/register`, {
      name,
      email,
      password,
    });
  }
}
