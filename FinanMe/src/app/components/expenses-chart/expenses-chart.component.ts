import { MatIconModule } from '@angular/material/icon';
import { IGasto } from './../../Interfaces/gasto.d';
import {
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { ExpensesStateService } from '../../services/expenses-state.service';
import { ICategory } from '../../Interfaces/category';

@Component({
  selector: 'app-expenses-chart',
  imports: [NgxChartsModule, MatTableModule, MatIconModule],
  templateUrl: './expenses-chart.component.html',
  styleUrl: './expenses-chart.component.scss',
})
export class ExpensesChartComponent implements OnInit {
  router = inject(Router);
  private expensesState = inject(ExpensesStateService);

  gastos: IGasto[] = [];
  total: number = 0;
  categories: ICategory[] = [];

  displayedColumns: string[] = ['name', 'percentage', 'value'];

  chartData: { name: string; value: number; percentage?: number }[] = [];

  ngOnInit(): void {
    this.expensesState.loadData();
    this.expensesState.gastos$.subscribe((gastos) => {
      this.gastos = gastos;
      this.total = this.expensesState.total;
      if (this.gastos.length && this.categories.length) {
        this.generateDataForChart();
      }
    });

    this.expensesState.categories$.subscribe((categories) => {
      this.categories = categories;
      if (this.gastos.length && this.categories.length) {
        this.generateDataForChart();
      }
    });
  }
  // ngOnChanges(changes: SimpleChanges): void {
  //   if (this.gastos.length && this.categories.length) {
  //     this.generateDataForChart();
  //   }
  // }
  generateDataForChart() {
    this.chartData = [];

    for (const category of this.categories) {
      const totalByCategory = this.gastos
        .filter((gasto) => gasto.category === category.name)
        .reduce((acc, gasto) => acc + gasto.expense, 0);
      if (totalByCategory > 0) {
        const percentage = (totalByCategory / this.total) * 100;
        this.chartData.push({
          name: category.name,
          value: totalByCategory,
          percentage: Number(percentage.toFixed(0)),
        });
      }
    }
    console.log(this.chartData);
  }

  view: [number, number] = [400, 200];

  addExpense(): void {
    this.router.navigate(['anadir-gasto']);
  }
}
