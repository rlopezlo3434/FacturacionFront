import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalWorkOrderDetailDialogComponent } from './modal-work-order-detail-dialog.component';

describe('ModalWorkOrderDetailDialogComponent', () => {
  let component: ModalWorkOrderDetailDialogComponent;
  let fixture: ComponentFixture<ModalWorkOrderDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalWorkOrderDetailDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalWorkOrderDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
