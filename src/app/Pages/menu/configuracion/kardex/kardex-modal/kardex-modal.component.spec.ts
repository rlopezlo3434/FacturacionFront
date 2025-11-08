import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KardexModalComponent } from './kardex-modal.component';

describe('KardexModalComponent', () => {
  let component: KardexModalComponent;
  let fixture: ComponentFixture<KardexModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KardexModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KardexModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
