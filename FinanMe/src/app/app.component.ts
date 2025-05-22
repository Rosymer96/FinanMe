import { ServicioHttpService } from './services/servicio-http.service';
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IGasto } from './Interfaces/gasto';
import { ServiceService } from './services/service.service';
import { HeaderComponent } from './components/header/header.component';
import { ExpensesChartComponent } from './components/expenses-chart/expenses-chart.component';
import { ExpensesFormComponent } from './components/expenses-form/expenses-form.component';
import { ExpenseListComponent } from './components/expense-list/expense-list.component';
import { ICategory } from './Interfaces/category';

@Component({
  selector: 'app-root',
  imports: [
    HeaderComponent,
    ExpensesChartComponent,
    ExpensesFormComponent,
    ExpenseListComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  service = inject(ServiceService);
  servicioHttpService = inject(ServicioHttpService);

  title = 'FinanMe';

  gastos: IGasto[] = [];
  total: number = 0;

  categories: string[] = [];

  ngOnInit(): void {
    this.servicioHttpService.getAll().subscribe((answer) => {
      this.gastos = answer;
      this.total = this.service.calculateTotal(this.gastos);
    });
    this.servicioHttpService.getCategories().subscribe((answer) => {
      this.categories = answer.map((c) => c.name);
    });
  }

  onNewExpense(gasto: IGasto) {
    this.gastos = [...this.gastos, gasto];
    this.total = this.service.calculateTotal(this.gastos);
  }
  onDeleteExpense(id: number) {
    this.servicioHttpService.deleteExpense(id).subscribe();
    this.gastos = this.gastos.filter((gasto) => gasto.id !== id);
  }
}
