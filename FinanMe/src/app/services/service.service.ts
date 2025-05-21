import { Injectable } from '@angular/core';
import { IGasto } from '../Interfaces/gasto';
@Injectable({
  providedIn: 'root',
})
export class ServiceService {
  public calculateTotal(gastos: IGasto[]): number {
    return gastos.reduce((acc, gasto) => acc + gasto.expense!, 0);
  }
}
