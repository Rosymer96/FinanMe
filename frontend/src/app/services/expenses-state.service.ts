import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IGasto, IGastoCreation } from '../Interfaces/gasto';
import { ICategory } from '../Interfaces/category';
import { AuthService } from '../core/services/auth.service';

type StoredExpense = IGasto & {
  userId: string;
};

@Injectable({
  providedIn: 'root',
})
export class ExpensesStateService {
  private readonly authService = inject(AuthService);
  private readonly storageKey = 'finanme.expenses';

  private readonly defaultCategories: ICategory[] = [
    { id: 1, name: 'Alimentación' },
    { id: 2, name: 'Transporte' },
    { id: 3, name: 'Vivienda' },
    { id: 4, name: 'Salud' },
    { id: 5, name: 'Ocio' },
    { id: 6, name: 'Suscripciones' },
    { id: 7, name: 'Ahorro' },
  ];

  private gastosSubject = new BehaviorSubject<IGasto[]>([]);
  gastos$ = this.gastosSubject.asObservable();

  private categoriesSubject = new BehaviorSubject<ICategory[]>([]);
  categories$ = this.categoriesSubject.asObservable();

  private readExpenses(): StoredExpense[] {
    const storedExpenses = localStorage.getItem(this.storageKey);
    return storedExpenses
      ? (JSON.parse(storedExpenses) as StoredExpense[])
      : [];
  }

  private writeExpenses(expenses: StoredExpense[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(expenses));
  }

  private getCurrentUserId(): string | null {
    return this.authService.getCurrentUser()?.id ?? null;
  }

  loadData() {
    const userId = this.getCurrentUserId();

    this.categoriesSubject.next(this.defaultCategories);

    if (!userId) {
      this.gastosSubject.next([]);
      return;
    }

    const userExpenses = this.readExpenses().filter(
      (expense) => expense.userId === userId,
    );

    this.gastosSubject.next(userExpenses);
  }

  addExpense(gasto: IGastoCreation) {
    const userId = this.getCurrentUserId();

    if (!userId) {
      return;
    }

    const currentExpenses = this.readExpenses();
    const newExpense: StoredExpense = {
      ...gasto,
      id: Date.now(),
      userId,
    };

    this.writeExpenses([...currentExpenses, newExpense]);
    this.gastosSubject.next([...this.gastosSubject.getValue(), newExpense]);
  }

  deleteExpense(id: number) {
    const userId = this.getCurrentUserId();

    if (!userId) {
      return;
    }

    const updatedExpenses = this.readExpenses().filter(
      (expense) => !(expense.id === id && expense.userId === userId),
    );

    this.writeExpenses(updatedExpenses);

    const updatedUserExpenses = this.gastosSubject
      .getValue()
      .filter((expense) => expense.id !== id);

    this.gastosSubject.next(updatedUserExpenses);
  }

  get total(): number {
    return this.gastosSubject
      .getValue()
      .reduce((acc, gasto) => acc + gasto.expense, 0);
  }
}
