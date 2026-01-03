import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManoDeObraComponent } from './mano-de-obra.component';

describe('ManoDeObraComponent', () => {
  let component: ManoDeObraComponent;
  let fixture: ComponentFixture<ManoDeObraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManoDeObraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManoDeObraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
