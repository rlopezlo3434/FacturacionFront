import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalModelDialogComponent } from './modal-model-dialog.component';

describe('ModalModelDialogComponent', () => {
  let component: ModalModelDialogComponent;
  let fixture: ComponentFixture<ModalModelDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalModelDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalModelDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
