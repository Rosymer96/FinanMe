import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IGasto, IGastoCreation } from '../Interfaces/gasto';
import { Observable } from 'rxjs';
import { ICategory } from '../Interfaces/category';

@Injectable({
  providedIn: 'root',
})
export class ServicioHttpService {
  httpClient = inject(HttpClient);

  private API_URL_EXPENSES: string = 'http://localhost:3000/gastos';

  public getAll(): Observable<IGasto[]> {
    return this.httpClient.get<IGasto[]>(this.API_URL_EXPENSES);
  }
  public addExpense(gasto: IGastoCreation): Observable<IGasto> {
    return this.httpClient.post<IGasto>(this.API_URL_EXPENSES, gasto);
  }
  public deleteExpense(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.API_URL_EXPENSES}/${id}`);
  }

  public getCategories(): Observable<ICategory[]> {
    return this.httpClient.get<ICategory[]>('http://localhost:3000/categories');
  }
}
