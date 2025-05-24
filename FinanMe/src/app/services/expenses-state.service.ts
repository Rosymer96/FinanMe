import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IGasto, IGastoCreation } from '../Interfaces/gasto';
import { ICategory } from '../Interfaces/category';
import { ServicioHttpService } from './servicio-http.service';

@Injectable({
  providedIn: 'root',
})
export class ExpensesStateService {
  // Usamos inject para conectarnos con el servicio que se conecta con el servidor
  private servicioHttpService = inject(ServicioHttpService);

  //Creación de los BehaviorSubjects que van a conectarse con el servicioHttpClient para manejar la informacion y repartirla a todos los componentes. Y los convertimos en observables para que otros puedan escuchar los cambios.

  private gastosSubject = new BehaviorSubject<IGasto[]>([]);
  gastos$ = this.gastosSubject.asObservable();

  private categoriesSubject = new BehaviorSubject<ICategory[]>([]);
  categories$ = this.categoriesSubject.asObservable();

  //Métodos que se conectan a servicioHttp a través de los obserbables.

  // Este método carga los datos desde el servidor y los guarda en las cajas
  loadData() {
    this.servicioHttpService.getAll().subscribe((gastos) => {
      this.gastosSubject.next(gastos); // Actualiza la lista de gastos
    });

    this.servicioHttpService.getCategories().subscribe((categories) => {
      this.categoriesSubject.next(categories); // Actualiza la lista de categorías
    });
  }
  // Este método agrega un nuevo gasto y lo añade a la lista

  addExpense(gasto: IGastoCreation) {
    this.servicioHttpService.addExpense(gasto).subscribe((nuevo) => {
      const current = this.gastosSubject.getValue(); // Obtiene la lista actual
      this.gastosSubject.next([...current, nuevo]); // Añade el nuevo gasto a la lista
    });
  }
  // Este método elimina un gasto según su id

  deleteExpense(id: number) {
    this.servicioHttpService.deleteExpense(id).subscribe(() => {
      const updated = this.gastosSubject.getValue().filter((g) => g.id !== id);
      this.gastosSubject.next(updated);
    });
  }
  // Calcula el total de todos los gastos sumando cada uno
  get total(): number {
    return this.gastosSubject
      .getValue()
      .reduce((acc, gasto) => acc + gasto.expense, 0);
  }
}
