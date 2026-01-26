import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MmodalProductDialogComponent } from './mmodal-product-dialog.component';

describe('MmodalProductDialogComponent', () => {
  let component: MmodalProductDialogComponent;
  let fixture: ComponentFixture<MmodalProductDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MmodalProductDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MmodalProductDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
