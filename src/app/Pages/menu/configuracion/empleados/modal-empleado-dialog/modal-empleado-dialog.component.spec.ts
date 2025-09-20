import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEmpleadoDialogComponent } from './modal-empleado-dialog.component';

describe('ModalEmpleadoDialogComponent', () => {
  let component: ModalEmpleadoDialogComponent;
  let fixture: ComponentFixture<ModalEmpleadoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalEmpleadoDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalEmpleadoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
