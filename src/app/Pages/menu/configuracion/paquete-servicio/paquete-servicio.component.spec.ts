import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaqueteServicioComponent } from './paquete-servicio.component';

describe('PaqueteServicioComponent', () => {
  let component: PaqueteServicioComponent;
  let fixture: ComponentFixture<PaqueteServicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaqueteServicioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaqueteServicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
