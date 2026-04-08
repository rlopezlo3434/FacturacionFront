import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarFacturacionComponent } from './listar-facturacion.component';

describe('ListarFacturacionComponent', () => {
  let component: ListarFacturacionComponent;
  let fixture: ComponentFixture<ListarFacturacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListarFacturacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarFacturacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
