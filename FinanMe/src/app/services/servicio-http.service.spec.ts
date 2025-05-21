import { TestBed } from '@angular/core/testing';

import { ServicioHttpService } from './servicio-http.service';

describe('ServicioHttpService', () => {
  let service: ServicioHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicioHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
