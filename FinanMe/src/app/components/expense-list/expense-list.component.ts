import {
  Component,
  EventEmitter,
  inject,
  Input,
  input,
  OnChanges,
  OnInit,
  Output,
  output,
  SimpleChanges,
} from '@angular/core';
import { ServicioHttpService } from '../../services/servicio-http.service';
import { IGasto } from '../../Interfaces/gasto';
import { ServiceService } from '../../services/service.service';
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

  gastos: IGasto[] = [];
  categories: ICategory[] = [];
  filteredGastos: IGasto[] = [];
  total: number = 0;

  // @Output() deleteExpense = new EventEmitter<number>();

  displayedColumns: string[] = [
    'date',
    'category',
    'description',
    'expense',
    'actions',
  ];

  form: FormGroup = new FormGroup({
    description: new FormControl(''),
    category: new FormControl(),
    startDate: new FormControl<Date | null>(null),
    endDate: new FormControl<Date | null>(null),
  });

  ngOnInit(): void {
    this.expensesState.loadData();
    this.expensesState.gastos$.subscribe((gastos) => {
      this.gastos = gastos;
      this.filteredGastos = [...this.gastos];
      this.calculateTotal();
    });

    this.expensesState.categories$.subscribe((categories) => {
      this.categories = categories;
    });
  }
  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes['gastos']) {
  //     this.filteredGastos = [...this.gastos];
  //     this.calculateTotal();
  //   }
  // }
  // total = input<number>();
  //gastos = input<IGasto[]>();

  filterData() {
    // console.log(this.form.value);

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
    this.calculateTotal();
  }

  cleanFilters() {
    console.log('limpiando');
    this.form.reset();
    this.filteredGastos = [...this.gastos];
    this.calculateTotal();
  }

  onDeleteExpense(id: number) {
    this.expensesState.deleteExpense(id);
  }

  calculateTotal(): number {
    let total = this.filteredGastos.reduce(
      (acc, gasto) => acc + gasto.expense,
      0
    );
    return total;
  }
}
