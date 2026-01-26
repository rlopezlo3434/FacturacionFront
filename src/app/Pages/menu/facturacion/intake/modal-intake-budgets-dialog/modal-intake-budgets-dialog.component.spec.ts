import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalIntakeBudgetsDialogComponent } from './modal-intake-budgets-dialog.component';

describe('ModalIntakeBudgetsDialogComponent', () => {
  let component: ModalIntakeBudgetsDialogComponent;
  let fixture: ComponentFixture<ModalIntakeBudgetsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalIntakeBudgetsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalIntakeBudgetsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
