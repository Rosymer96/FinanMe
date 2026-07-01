import { Component, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { ExpensesStateService } from './services/expenses-state.service';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private readonly router = inject(Router);
  expensesState = inject(ExpensesStateService);
  showShell = false;

  ngOnInit(): void {
    this.showShell = !this.router.url.startsWith('/auth');

    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.showShell = !event.urlAfterRedirects.startsWith('/auth');
      }
    });

    this.expensesState.loadData();
  }
}
