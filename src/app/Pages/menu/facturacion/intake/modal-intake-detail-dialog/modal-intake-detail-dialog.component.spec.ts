import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalIntakeDetailDialogComponent } from './modal-intake-detail-dialog.component';

describe('ModalIntakeDetailDialogComponent', () => {
  let component: ModalIntakeDetailDialogComponent;
  let fixture: ComponentFixture<ModalIntakeDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalIntakeDetailDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalIntakeDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
