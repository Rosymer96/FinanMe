import { ExpensesStateService } from '../../services/expenses-state.service';
import { ServiceService } from '../../services/service.service';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IGasto, IGastoCreation } from '../../Interfaces/gasto';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { ICategory } from '../../Interfaces/category';
import { Router } from '@angular/router';
@Component({
  selector: 'app-expenses-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  providers: [ServiceService],
  templateUrl: './expenses-form.component.html',
  styleUrl: './expenses-form.component.scss',
})
export class ExpensesFormComponent implements OnInit {
  private expensesState = inject(ExpensesStateService);
  private router = inject(Router);

  public categories: ICategory[] = []; // Aquí guardamos las categorías disponibles

  ngOnInit(): void {
    // Al iniciar el componente, cargamos los datos de gastos y categorías

    this.expensesState.loadData();
    this.expensesState.categories$.subscribe((categories) => {
      this.categories = categories;
    });
    console.log(this.categories);
  }
  //Guardamos la fecha, separamos de la hora y la usamos como limite en el calendario.
  todayDate = new Date();
  today: string = this.todayDate.toISOString().split('T')[0];

  //Construimos el formulario reactivo y lo validamos.
  form: FormGroup = new FormGroup({
    expense: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    category: new FormControl('', [Validators.required, Validators.min(0)]),
    date: new FormControl('', [Validators.required]),
  });
  // Métodos que se ejecuta cuando el usuario envía el formulario
  onAddExpense() {
    if (this.form.invalid) {
      // debugger;
      this.form.markAllAsTouched();
      return;
    }
    // Obtenemos los valores del formulario
    const { expense, description, category, date } = this.form.value;
    // Creamos el objeto que se enviará al servicio
    const gastoCreation: IGastoCreation = {
      expense,
      description,
      category: category.name, // Se espera que la categoría sea un objeto con `name`
      date,
    };
    // Enviamos el gasto nuevo y reiniciamos el formulario

    this.expensesState.addExpense(gastoCreation);
    this.form.reset();
    // Redirigimos a la lista de gastos
    this.router.navigate(['gastos-lista']);
  }
}
