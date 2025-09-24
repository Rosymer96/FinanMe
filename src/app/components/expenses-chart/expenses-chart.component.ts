import { MatIconModule } from '@angular/material/icon';
import { IGasto } from './../../Interfaces/gasto.d';
import { Component, inject, OnInit } from '@angular/core';
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
  // Variables para guardar los datos
  gastos: IGasto[] = [];
  total: number = 0;
  categories: ICategory[] = [];
  // Columnas visibles en la tabla

  chartData: { name: string; value: number; percentage?: number }[] = [];

  ngOnInit(): void {
    // Carga los datos de gastos y categorías desde el servicio
    this.expensesState.loadData();
    // Se actualiza cuando llegan los gastos
    this.expensesState.gastos$.subscribe((gastos) => {
      this.gastos = gastos;
      this.total = this.expensesState.total;
      if (this.gastos.length && this.categories.length) {
        this.generateDataForChart();
      }
    });

    this.expensesState.categories$.subscribe((categories) => {
      this.categories = categories;
      // Solo genera el gráfico si ya se tienen las categorías
      if (this.gastos.length && this.categories.length) {
        this.generateDataForChart();
      }
    });
  }
  // Función que genera los datos del gráfico

  generateDataForChart() {
    this.chartData = [];
    // Recorre cada categoría y suma los gastos que corresponden a esa categoría

    for (const category of this.categories) {
      const totalByCategory = this.gastos
        .filter((gasto) => gasto.category === category.name)
        .reduce((acc, gasto) => acc + gasto.expense, 0);
      // Si hay gastos en esa categoría, los agrega al gráfico
      if (totalByCategory > 0) {
        const percentage = (totalByCategory / this.total) * 100;
        this.chartData.push({
          name: category.name,
          value: totalByCategory,
          percentage: Number(percentage.toFixed(0)),
        });
      }
    }
    // console.log(this.chartData);
  }
  // Tamaño del gráfico en píxeles (ancho x alto) 
  view: [number, number] = [350, 500];
  // Opciones del gráfico
  showLegend: boolean = true; 

  // Navega a la vista de añadir un nuevo gasto
  addExpense(): void {
    this.router.navigate(['anadir-gasto']);
  }
}
