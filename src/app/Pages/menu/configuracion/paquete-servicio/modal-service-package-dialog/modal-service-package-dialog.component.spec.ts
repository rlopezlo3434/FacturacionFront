import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalServicePackageDialogComponent } from './modal-service-package-dialog.component';

describe('ModalServicePackageDialogComponent', () => {
  let component: ModalServicePackageDialogComponent;
  let fixture: ComponentFixture<ModalServicePackageDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalServicePackageDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalServicePackageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
