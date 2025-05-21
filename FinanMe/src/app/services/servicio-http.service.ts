import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IGasto, IGastoCreation } from '../Interfaces/gasto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServicioHttpService {
  httpClient = inject(HttpClient);

  private API_URL: string = 'http://localhost:3000/gastos';

  public getAll(): Observable<IGasto[]> {
    return this.httpClient.get<IGasto[]>(this.API_URL);
  }
  public addExpense(gasto: IGastoCreation): Observable<IGasto> {
    return this.httpClient.post<IGasto>(this.API_URL, gasto);
  }
  public deleteExpense(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.API_URL}/${id}`);
  }
}
