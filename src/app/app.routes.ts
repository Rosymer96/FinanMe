import { Routes } from '@angular/router';
import { ExpensesFormComponent } from './components/expenses-form/expenses-form.component';
import { ExpenseListComponent } from './components/expense-list/expense-list.component';
import { ExpensesChartComponent } from './components/expenses-chart/expenses-chart.component';
import { RegisterUserComponent } from './components/register-user/register-user.component';
import { LoginUserComponent } from './components/login-user/login-user.component';

export const routes: Routes = [
  { path: '', component: LoginUserComponent},
  { path: 'anadir-gasto', component: ExpensesFormComponent },
  { path: 'gastos-lista', component: ExpenseListComponent },
  { path: 'gastos', component: ExpenseListComponent },
  { path: 'register', component: RegisterUserComponent },
];
