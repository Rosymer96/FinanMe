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
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ServicioHttpService } from '../../services/servicio-http.service';
import { IGasto, IGastoCreation } from '../../Interfaces/gasto';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
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
export class ExpensesFormComponent {
  servicioHttpService = inject(ServicioHttpService);

  // newExpense = output<IGasto>();
  @Output() newExpense = new EventEmitter<IGasto>();
  @Input() categories: string[] = [];

  // categories = input<string[]>();

  todayDate = new Date();
  today: string = this.todayDate.toISOString().split('T')[0];
  form: FormGroup = new FormGroup({
    expense: new FormControl(),
    description: new FormControl(''),
    category: new FormControl(),
    date: new FormControl(),
  });

  onAddExpense() {
    const gastoCreation: IGastoCreation = this.form.value;
    this.servicioHttpService
      .addExpense(gastoCreation)
      .subscribe((nuevoGasto) => {
        this.newExpense.emit(nuevoGasto);
        this.form.reset();
      });
  }
}
