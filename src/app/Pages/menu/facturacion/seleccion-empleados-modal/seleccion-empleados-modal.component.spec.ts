import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeleccionEmpleadosModalComponent } from './seleccion-empleados-modal.component';

describe('SeleccionEmpleadosModalComponent', () => {
  let component: SeleccionEmpleadosModalComponent;
  let fixture: ComponentFixture<SeleccionEmpleadosModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SeleccionEmpleadosModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeleccionEmpleadosModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
