import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalHijosDialogComponent } from './modal-hijos-dialog.component';

describe('ModalHijosDialogComponent', () => {
  let component: ModalHijosDialogComponent;
  let fixture: ComponentFixture<ModalHijosDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalHijosDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalHijosDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
