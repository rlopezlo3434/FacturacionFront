import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalClientesDialogComponent } from './modal-clientes-dialog.component';

describe('ModalClientesDialogComponent', () => {
  let component: ModalClientesDialogComponent;
  let fixture: ComponentFixture<ModalClientesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalClientesDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalClientesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
