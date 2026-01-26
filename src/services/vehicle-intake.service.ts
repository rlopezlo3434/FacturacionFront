import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VehicleIntakeService {

  token = localStorage.getItem('token');

  constructor(private http: HttpClient) { }

  getInventoryMaster() {
    return this.http.get(`${environment.apiBase}/VehicleIntakes/inventory-master`, {
      headers: { Authorization: `Bearer ${this.token}` }
    });
  }

  createIntake(payload: any) {
    return this.http.post(`${environment.apiBase}/VehicleIntakes`, payload, {
      headers: { Authorization: `Bearer ${this.token}` }
    });
  }

  getIntakes() {
    return this.http.get(`${environment.apiBase}/VehicleIntakes`, {
      headers: { Authorization: `Bearer ${this.token}` }
    });
  }

  getIntakeDetail(id: number) {
  return this.http.get(`${environment.apiBase}/VehicleIntakes/${id}`, {
    headers: { Authorization: `Bearer ${this.token}` }
  });
}
}
