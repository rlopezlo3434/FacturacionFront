import { TestBed } from '@angular/core/testing';

import { PaqueteServicioService } from './paquete-servicio.service';

describe('PaqueteServicioService', () => {
  let service: PaqueteServicioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaqueteServicioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
