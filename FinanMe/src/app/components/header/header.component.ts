import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, MatIconModule, MatButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  router = inject(Router);
  isMenuOpen = false;

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
  goHome(): void {
    this.router.navigate(['']);
    this.isMenuOpen = false;
  }

  addExpense(): void {
    this.router.navigate(['anadir-gasto']);
    this.isMenuOpen = false;
  }
  filterExpenses(): void {
    this.router.navigate(['gastos-lista']);
    this.isMenuOpen = false;
  }
}
