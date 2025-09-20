import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalItemDialogComponent } from './modal-item-dialog.component';

describe('ModalItemDialogComponent', () => {
  let component: ModalItemDialogComponent;
  let fixture: ComponentFixture<ModalItemDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalItemDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalItemDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
