import { Routes } from '@angular/router';
import { ExpensesFormComponent } from './components/expenses-form/expenses-form.component';
import { ExpenseListComponent } from './components/expense-list/expense-list.component';
import { ExpensesChartComponent } from './components/expenses-chart/expenses-chart.component';

export const routes: Routes = [
  { path: '', component: ExpensesChartComponent },
  { path: 'anadir-gasto', component: ExpensesFormComponent },
  { path: 'gastos-lista', component: ExpenseListComponent },
];
