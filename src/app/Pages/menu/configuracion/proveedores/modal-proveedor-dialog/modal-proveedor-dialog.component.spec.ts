import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalProveedorDialogComponent } from './modal-proveedor-dialog.component';

describe('ModalProveedorDialogComponent', () => {
  let component: ModalProveedorDialogComponent;
  let fixture: ComponentFixture<ModalProveedorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalProveedorDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalProveedorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
