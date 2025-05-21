import { IGasto } from './../../Interfaces/gasto.d';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AppComponent } from '../../app.component';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-expenses-chart',
  imports: [NgxChartsModule, MatTableModule],
  templateUrl: './expenses-chart.component.html',
  styleUrl: './expenses-chart.component.scss',
})
export class ExpensesChartComponent implements OnChanges {
  @Input() gastos: IGasto[] = [];
  @Input() total: number = 0;
  @Input() categories: string[] = [];
  displayedColumns: string[] = ['name', 'value', 'percentage'];

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
          percentage: Number(percentage.toFixed(2)),
        });
      }
    }
    console.log(this.chartData);
  }

  view: [number, number] = [400, 200];
}
