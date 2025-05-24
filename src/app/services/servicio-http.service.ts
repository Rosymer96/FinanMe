import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IGasto, IGastoCreation } from '../Interfaces/gasto';
import { Observable } from 'rxjs';
import { ICategory } from '../Interfaces/category';

@Injectable({
  providedIn: 'root',
})
export class ServicioHttpService {
  //Servicio que se conecta con la API FAKE db.json que se encuentra en la carpeta public.

  httpClient = inject(HttpClient);

  private API_URL_EXPENSES: string = 'http://localhost:3000/gastos';
  // Método para obtener todos los gastos desde el servidor
  public getAll(): Observable<IGasto[]> {
    return this.httpClient.get<IGasto[]>(this.API_URL_EXPENSES);
  }
  // Método para agregar un nuevo gasto
  public addExpense(gasto: IGastoCreation): Observable<IGasto> {
    return this.httpClient.post<IGasto>(this.API_URL_EXPENSES, gasto);
  }
  // Método para eliminar un gasto según su id
  public deleteExpense(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.API_URL_EXPENSES}/${id}`);
  }
  // Método para obtener las categorías de gastos desde el servidor
  public getCategories(): Observable<ICategory[]> {
    return this.httpClient.get<ICategory[]>('http://localhost:3000/categories');
  }
}
