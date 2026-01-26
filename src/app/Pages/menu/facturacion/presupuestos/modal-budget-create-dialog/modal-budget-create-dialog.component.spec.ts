import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalBudgetCreateDialogComponent } from './modal-budget-create-dialog.component';

describe('ModalBudgetCreateDialogComponent', () => {
  let component: ModalBudgetCreateDialogComponent;
  let fixture: ComponentFixture<ModalBudgetCreateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalBudgetCreateDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalBudgetCreateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
