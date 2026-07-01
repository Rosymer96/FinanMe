import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ExpensesChartComponent } from '../../components/expenses-chart/expenses-chart.component';
import { ExpensesFormComponent } from '../../components/expenses-form/expenses-form.component';
import { ExpenseListComponent } from '../../components/expense-list/expense-list.component';
import { ExpensesStateService } from '../../services/expenses-state.service';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    ExpensesFormComponent,
    ExpensesChartComponent,
    ExpenseListComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly expensesState = inject(ExpensesStateService);
  private readonly router = inject(Router);

  currentUser$ = this.authService.currentUser$;

  ngOnInit(): void {
    this.expensesState.loadData();
  }

  logout(): void {
    this.authService.logout();
  }

  goToAddExpense(): void {
    this.router.navigate(['/anadir-gasto']);
  }
}
