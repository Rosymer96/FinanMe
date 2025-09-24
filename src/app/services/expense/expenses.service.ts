import { inject, Injectable } from '@angular/core';
import { environment } from '../../enviroments/enviroment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IGasto } from '../../Interfaces/gasto';

@Injectable({
  providedIn: 'root',
})
export class ExpensesService {
  private httpCliente = inject(HttpClient);

  private API_URL: string = `${environment.API_BASE_URL}/expense`;

  public listExpenses(): Observable<IGasto[]> {
    return this.httpCliente.get<IGasto[]>(`${this.API_URL}/list`);
  }
}
