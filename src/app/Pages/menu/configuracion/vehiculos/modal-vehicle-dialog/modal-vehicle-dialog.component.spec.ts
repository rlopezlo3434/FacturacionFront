import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalVehicleDialogComponent } from './modal-vehicle-dialog.component';

describe('ModalVehicleDialogComponent', () => {
  let component: ModalVehicleDialogComponent;
  let fixture: ComponentFixture<ModalVehicleDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalVehicleDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalVehicleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
