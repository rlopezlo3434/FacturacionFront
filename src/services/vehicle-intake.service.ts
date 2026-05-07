import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehicleIntakeService {

  token = localStorage.getItem('token');

  constructor(private http: HttpClient) { }

  private getHeaders() {
    return {
      Authorization: `Bearer ${this.token}`
    };
  }

  getInventoryMaster() {
    return this.http.get(`${environment.apiBase}/VehicleIntakes/inventory-master`, {
      headers: { Authorization: `Bearer ${this.token}` }
    });
  }

  // createIntake(payload: any) {
  //   return this.http.post(`${environment.apiBase}/VehicleIntakes`, payload, {
  //     headers: { Authorization: `Bearer ${this.token}` }
  //   });
  // }

  createIntake(formData: FormData) {
    return this.http.post(`${environment.apiBase}/VehicleIntakes`, formData, {
      headers: { Authorization: `Bearer ${this.token}` }
    });
  }

  updateIntake(id: number, formData: FormData) {
    return this.http.put(`${environment.apiBase}/VehicleIntakes/${id}`, formData, {
      headers: { Authorization: `Bearer ${this.token}` }
    });
  }

  getIntakePDF(intakeId: number) {
    return this.http.get(`${environment.apiBase}/Pdf/${intakeId}/internamiento`, {
      headers: this.getHeaders(),
      responseType: 'blob'
    });
  }

  deleteIntake(id: number): Observable<any> {
    return this.http.delete(`${environment.apiBase}/VehicleIntakes/${id}`);
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
