import { ServicioHttpService } from './services/servicio-http.service';
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { ExpensesStateService } from './services/expenses-state.service';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  expensesState = inject(ExpensesStateService);

  //Invocando la data a través de expensesState en el OnInit para que esté cargada desde el inicio.
  ngOnInit(): void {
    this.expensesState.loadData();
  }
}
