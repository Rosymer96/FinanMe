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
  ],
  templateUrl: './expense-list.component.html',
  styleUrl: './expense-list.component.scss',
})
export class ExpenseListComponent implements OnInit, OnChanges {
  servicioHttpService = inject(ServicioHttpService);
  services = inject(ServiceService);
  @Input() gastos: IGasto[] = [];
  @Input() total: number = 0;
  @Input() categories: string[] = [];

  @Output() deleteExpense = new EventEmitter<number>();

  filteredGastos: IGasto[] = [];

  ngOnInit(): void {
    this.filteredGastos = [...this.gastos];
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['gastos']) {
      this.filteredGastos = [...this.gastos];
      this.total = this.filteredGastos.reduce(
        (acc, gasto) => acc + gasto.expense,
        0
      );
    }
  }
  // total = input<number>();
  //gastos = input<IGasto[]>();

  form: FormGroup = new FormGroup({
    description: new FormControl(''),
    category: new FormControl(),
    startDate: new FormControl<Date | null>(null),
    endDate: new FormControl<Date | null>(null),
  });

  filterData() {
    console.log(this.form.value);

    const { category, description, startDate, endDate } = this.form.value;
    // --- Filtrado con operadores ternarios ---
    this.filteredGastos = this.gastos.filter((gasto) => {
      // Si hay categoría ⇒ compara; si no hay ⇒ true
      const matchesCategory = category ? gasto.category === category : true;

      // Si hay descripción ⇒ incluye substring; si no hay ⇒ true
      const matchesDescription = description
        ? gasto.description.toLowerCase().includes(description.toLowerCase())
        : true;

      // Si hay startDate ⇒ fecha del gasto ≥ startDate; si no hay ⇒ true
      const matchesStartDate = startDate
        ? new Date(gasto.date) >= new Date(startDate)
        : true;

      // Si hay endDate ⇒ fecha del gasto ≤ endDate; si no hay ⇒ true
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
    this.total = this.filteredGastos.reduce(
      (acc, gasto) => acc + gasto.expense,
      0
    );
  }

  onDeleteExpense(id: number) {
    this.deleteExpense.emit(id);
  }
}
