import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IGasto, IGastoCreation } from '../Interfaces/gasto';
import { ICategory } from '../Interfaces/category';
import { ServicioHttpService } from './servicio-http.service';

@Injectable({
  providedIn: 'root',
})
export class ExpensesStateService {
  private servicioHttpService = inject(ServicioHttpService);

  private gastosSubject = new BehaviorSubject<IGasto[]>([]);
  gastos$ = this.gastosSubject.asObservable();

  private categoriesSubject = new BehaviorSubject<ICategory[]>([]);
  categories$ = this.categoriesSubject.asObservable();

  loadData() {
    this.servicioHttpService.getAll().subscribe((gastos) => {
      this.gastosSubject.next(gastos);
    });

    this.servicioHttpService.getCategories().subscribe((categories) => {
      this.categoriesSubject.next(categories);
    });
  }

  addExpense(gasto: IGastoCreation) {
    this.servicioHttpService.addExpense(gasto).subscribe((nuevo) => {
      const current = this.gastosSubject.getValue();
      this.gastosSubject.next([...current, nuevo]);
    });
  }

  deleteExpense(id: number) {
    this.servicioHttpService.deleteExpense(id).subscribe(() => {
      const updated = this.gastosSubject.getValue().filter((g) => g.id !== id);
      this.gastosSubject.next(updated);
    });
  }

  get total(): number {
    return this.gastosSubject
      .getValue()
      .reduce((acc, gasto) => acc + gasto.expense, 0);
  }
}
