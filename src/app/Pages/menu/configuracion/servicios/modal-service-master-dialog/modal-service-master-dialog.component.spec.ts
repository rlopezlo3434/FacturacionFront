import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalServiceMasterDialogComponent } from './modal-service-master-dialog.component';

describe('ModalServiceMasterDialogComponent', () => {
  let component: ModalServiceMasterDialogComponent;
  let fixture: ComponentFixture<ModalServiceMasterDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalServiceMasterDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalServiceMasterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
