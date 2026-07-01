import { Component, inject, OnInit } from '@angular/core';
import { IGasto } from '../../Interfaces/gasto';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { ExpensesStateService } from '../../services/expenses-state.service';
import { ICategory } from '../../Interfaces/category';
@Component({
  selector: 'app-expense-list',
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
    MatTableModule,
    MatIconModule,
  ],
  templateUrl: './expense-list.component.html',
  styleUrl: './expense-list.component.scss',
})
export class ExpenseListComponent implements OnInit {
  private expensesState = inject(ExpensesStateService);

  //Guardamos la informacion en estas variables.

  gastos: IGasto[] = [];
  categories: ICategory[] = [];
  filteredGastos: IGasto[] = [];
  total: number = 0;

  // Columnas que se muestran en la tabla.
  displayedColumns: string[] = [
    'date',
    'category',
    'description',
    'expense',
    'actions',
  ];
  // Formulario reactivo para los filtros (descripción, categoría y rango de fechas).

  form: FormGroup = new FormGroup({
    description: new FormControl(),
    category: new FormControl(),
    startDate: new FormControl<Date | null>(null),
    endDate: new FormControl<Date | null>(null),
  });

  ngOnInit(): void {
    this.expensesState.loadData(); // Cargamos datos al iniciar el componente.
    this.expensesState.gastos$.subscribe((gastos) => {
      this.gastos = gastos; // Cuando llegan los gastos, los guardamos.
      this.filteredGastos = [...this.gastos]; // Inicialmente mostramos todos (sin filtrar).
      this.total = this.expensesState.total; // Actualizamos el total con los gastos cargados.
    });

    this.expensesState.categories$.subscribe((categories) => {
      this.categories = categories; // Guardamos las categorías cuando llegan.
    });
  }

  // Variable para saber si el usuario ya aplicó filtro.
  submitted: boolean = false;

  filterData() {
    // debugger;
    this.submitted = true; // Indicamos que el filtro fue activado.

    // Extraemos los valores ingresados en el formulario.
    const { category, description, startDate, endDate } = this.form.value;

    // --- Filtrado con operadores ternarios ---
    this.filteredGastos = this.gastos.filter((gasto) => {
      // Si hay categoría ⇒  compara, si es igual da true, si es distinta da false ;
      //  si no hay categoria da true

      const matchesCategory = category
        ? gasto.category === category.name
        : true;

      // Si hay descripción y esta esta incluida en gasto.description es true,
      // si no es false pero  si esta vacia es ⇒ true.
      const matchesDescription = description
        ? gasto.description.toLowerCase().includes(description.toLowerCase())
        : true;

      // Si hay startDate ⇒ verifico si fecha del gasto ≥ startDate, si es así es true,
      // si es menor es false y  si no hay startDate es true
      const matchesStartDate = startDate
        ? new Date(gasto.date) >= new Date(startDate)
        : true;

      // Si hay endDate ⇒ fecha del gasto ≤ endDate, si es así es true,
      // si es mayor es false y  si no hay endDate es true.
      const matchesEndDate = endDate
        ? new Date(gasto.date) <= new Date(endDate)
        : true;

      // El gasto pasa el filtro solo si cumple TODO
      return (
        matchesCategory &&
        matchesDescription &&
        matchesStartDate &&
        matchesEndDate
      );
    });

    // Recalcula el total según los resultados filtrados
    this.total = this.calculateTotal();
  }

  cleanFilters() {
    this.form.reset(); // Limpiamos el formulario de filtros.
    this.filteredGastos = [...this.gastos]; // Mostramos todos los gastos sin filtrar.
    this.total = this.calculateTotal(); // Actualizamos el total.
    this.submitted = false; // Indicamos que no hay filtros activos.
  }

  onDeleteExpense(id: number) {
    this.expensesState.deleteExpense(id); // Llamamos al servicio para eliminar el gasto por su id.
  }

  calculateTotal(): number {
    // Sumamos todos los gastos que están en filteredGastos y devolvemos el resultado.
    let total = this.filteredGastos.reduce(
      (acc, gasto) => acc + gasto.expense,
      0
    );
    return total;
  }
}
