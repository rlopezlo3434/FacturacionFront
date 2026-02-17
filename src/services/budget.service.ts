import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {

  private token = localStorage.getItem('token');

  constructor(private http: HttpClient) {}

  private getHeaders() {
    return {
      Authorization: `Bearer ${this.token}`
    };
  }

  // ✅ Listar presupuestos por internamiento
  getBudgetsByIntake(intakeId: number) {
    return this.http.get(`${environment.apiBase}/VehicleBudget/intake/${intakeId}`, {
      headers: this.getHeaders()
    });
  }

  // ✅ Detalle de presupuesto (cabecera + items)
  getBudgetDetail(budgetId: number) {
    return this.http.get(`${environment.apiBase}/VehicleBudget/${budgetId}`, {
      headers: this.getHeaders()
    });
  }

  // ✅ Crear presupuesto
  createBudget(payload: any) {
    return this.http.post(`${environment.apiBase}/VehicleBudget`, payload, {
      headers: this.getHeaders()
    });
  }

  saveItemApprovals(payload: any) {
    return this.http.post(`${environment.apiBase}/VehicleBudget/approve-items`, payload, {
      headers: this.getHeaders()
    });
  }

  // ✅ Aprobar presupuesto (deja 1 oficial)
  approveBudget(budgetId: number) {
    return this.http.put(`${environment.apiBase}/VehicleBudget/approve/${budgetId}`, {}, {
      headers: this.getHeaders()
    });
  }

  // ✅ (Opcional) Listar todos los presupuestos (pantalla global)
  getAllBudgets() {
    return this.http.get(`${environment.apiBase}/VehicleBudget`, {
      headers: this.getHeaders()
    });
  }
}
