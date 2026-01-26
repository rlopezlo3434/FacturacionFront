import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalIntakeDialogComponent } from './modal-intake-dialog.component';

describe('ModalIntakeDialogComponent', () => {
  let component: ModalIntakeDialogComponent;
  let fixture: ComponentFixture<ModalIntakeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalIntakeDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalIntakeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
