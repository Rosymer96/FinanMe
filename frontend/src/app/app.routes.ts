import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { ExpensesFormComponent } from './components/expenses-form/expenses-form.component';
import { ExpenseListComponent } from './components/expense-list/expense-list.component';
import { ExpensesChartComponent } from './components/expenses-chart/expenses-chart.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'auth/login' },
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  {
    path: 'anadir-gasto',
    component: ExpensesFormComponent,
    canActivate: [authGuard],
  },
  {
    path: 'gastos-lista',
    component: ExpenseListComponent,
    canActivate: [authGuard],
  },
  {
    path: 'estadisticas',
    component: ExpensesChartComponent,
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: 'auth/login' },
];
