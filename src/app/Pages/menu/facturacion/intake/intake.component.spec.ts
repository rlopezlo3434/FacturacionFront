import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntakeComponent } from './intake.component';

describe('IntakeComponent', () => {
  let component: IntakeComponent;
  let fixture: ComponentFixture<IntakeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IntakeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
