import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalBrandDialogComponent } from './modal-brand-dialog.component';

describe('ModalBrandDialogComponent', () => {
  let component: ModalBrandDialogComponent;
  let fixture: ComponentFixture<ModalBrandDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalBrandDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalBrandDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
