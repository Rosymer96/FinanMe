import { ExpensesStateService } from './../../services/expenses-state.service';
import { ServiceService } from './../../services/service.service';
import {
  Component,
  EventEmitter,
  inject,
  input,
  Input,
  OnInit,
  Output,
  output,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ServicioHttpService } from '../../services/servicio-http.service';
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

  public categories: ICategory[] = [];

  ngOnInit(): void {
    this.expensesState.loadData();
    this.expensesState.categories$.subscribe((categories) => {
      this.categories = categories;
    });
    console.log(this.categories);
  }
  //Guardamos la fecha, separamos de la hora y la usamos como limite en el calendario.
  todayDate = new Date();
  today: string = this.todayDate.toISOString().split('T')[0];

  //Construimos el formulario reactivo
  form: FormGroup = new FormGroup({
    expense: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    category: new FormControl('', [Validators.required, Validators.min(0)]),
    date: new FormControl('', [Validators.required]),
  });

  onAddExpense() {
    if (this.form.invalid) {
      // debugger;
      this.form.markAllAsTouched();
      return;
    }

    const { expense, description, category, date } = this.form.value;
    const gastoCreation: IGastoCreation = {
      expense,
      description,
      category: category.name,
      date,
    };
    this.expensesState.addExpense(gastoCreation);
    this.form.reset();
    this.router.navigate(['gastos-lista']);
  }
}
