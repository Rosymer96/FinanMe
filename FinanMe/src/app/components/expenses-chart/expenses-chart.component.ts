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

@Component({
  selector: 'app-expenses-chart',
  imports: [NgxChartsModule, MatTableModule, MatIconModule],
  templateUrl: './expenses-chart.component.html',
  styleUrl: './expenses-chart.component.scss',
})
export class ExpensesChartComponent implements OnChanges {
  router = inject(Router);

  @Input() gastos: IGasto[] = [];
  @Input() total: number = 0;
  @Input() categories: string[] = [];
  displayedColumns: string[] = ['name', 'percentage', 'value'];

  chartData: { name: string; value: number; percentage?: number }[] = [];
  ngOnChanges(changes: SimpleChanges): void {
    if (this.gastos.length && this.categories.length) {
      this.generateDataForChart();
    }
  }
  generateDataForChart() {
    this.chartData = [];

    for (const category of this.categories) {
      const totalByCategory = this.gastos
        .filter((gasto) => gasto.category === category)
        .reduce((acc, gasto) => acc + gasto.expense, 0);
      if (totalByCategory > 0) {
        const percentage = (totalByCategory / this.total) * 100;
        this.chartData.push({
          name: category,
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
