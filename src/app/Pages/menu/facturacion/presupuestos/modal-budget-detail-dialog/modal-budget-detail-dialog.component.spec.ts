import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalBudgetDetailDialogComponent } from './modal-budget-detail-dialog.component';

describe('ModalBudgetDetailDialogComponent', () => {
  let component: ModalBudgetDetailDialogComponent;
  let fixture: ComponentFixture<ModalBudgetDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalBudgetDetailDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalBudgetDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
