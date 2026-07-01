import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  imports: [AsyncPipe, MatToolbarModule, MatIconModule, MatButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  router = inject(Router);
  private readonly authService = inject(AuthService);

  currentUser$ = this.authService.currentUser$;
  isMenuOpen = false;

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  goHome(): void {
    this.router.navigate(['/dashboard']);
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

  goStatistics(): void {
    this.router.navigate(['/estadisticas']);
    this.isMenuOpen = false;
  }

  goLogin(): void {
    this.router.navigate(['/auth/login']);
    this.isMenuOpen = false;
  }

  goRegister(): void {
    this.router.navigate(['/auth/register']);
    this.isMenuOpen = false;
  }

  logout(): void {
    this.isMenuOpen = false;
    this.authService.logout();
  }
}
