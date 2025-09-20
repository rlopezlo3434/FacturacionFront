import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPromocionesDialogComponent } from './modal-promociones-dialog.component';

describe('ModalPromocionesDialogComponent', () => {
  let component: ModalPromocionesDialogComponent;
  let fixture: ComponentFixture<ModalPromocionesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalPromocionesDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalPromocionesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
