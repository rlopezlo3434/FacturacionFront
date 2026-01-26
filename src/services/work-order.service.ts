import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WorkOrderService {

  token = localStorage.getItem('token');

  constructor(private http: HttpClient) {}

  createFromIntake(intakeId: number) {
    return this.http.post(`${environment.apiBase}/WorkOrder/create-from-intake/${intakeId}`, {}, {
      headers: { Authorization: `Bearer ${this.token}` }
    });
  }

  getWorkOrderByIntake(intakeId: number) {
    return this.http.get(`${environment.apiBase}/WorkOrder/intake/${intakeId}`, {
      headers: { Authorization: `Bearer ${this.token}` }
    });
  }

  getWorkOrders() {
    return this.http.get(`${environment.apiBase}/WorkOrder`, {
      headers: { Authorization: `Bearer ${this.token}` }
    });
  }

  getWorkOrderDetail(id: number) {
    return this.http.get(`${environment.apiBase}/WorkOrder/${id}`, {
      headers: { Authorization: `Bearer ${this.token}` }
    });
  }

  updateItemStatus(payload: any) {
    return this.http.put(`${environment.apiBase}/WorkOrder/update-items`, payload, {
      headers: { Authorization: `Bearer ${this.token}` }
    });
  }
}
