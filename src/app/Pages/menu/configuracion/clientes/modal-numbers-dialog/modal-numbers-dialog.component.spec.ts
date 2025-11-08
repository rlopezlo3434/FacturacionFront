import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNumbersDialogComponent } from './modal-numbers-dialog.component';

describe('ModalNumbersDialogComponent', () => {
  let component: ModalNumbersDialogComponent;
  let fixture: ComponentFixture<ModalNumbersDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalNumbersDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalNumbersDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
