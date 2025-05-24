import { TestBed } from '@angular/core/testing';

import { ExpensesStateService } from './expenses-state.service';

describe('ExpensesStateService', () => {
  let service: ExpensesStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpensesStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
