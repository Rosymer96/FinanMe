import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, MatIconModule, MatButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  router = inject(Router);
  private userService = inject(UserService);
  // Variable para controlar si el menú está abierto o cerrado en móbiles.
  isMenuOpen = false;
  // Abre o cierra el menú
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
  // Navega a la página principal (home) y cierra el menú
  goHome(): void {
    this.router.navigate(['/gastos-lista']);
    this.isMenuOpen = false;
  }

  // Navega a la página para añadir un nuevo gasto y cierra el menú
  addExpense(): void {
    this.router.navigate(['anadir-gasto']);
    this.isMenuOpen = false;
  }
  // Navega a la página para ver/filtrar los gastos y cierra el menú
  filterExpenses(): void {
    this.router.navigate(['gastos-lista']);
    this.isMenuOpen = false;
  }
}
