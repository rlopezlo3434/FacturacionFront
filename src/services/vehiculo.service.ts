import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VehiculoService {

  token: string | null = null;


  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('auth_token');
  }

  updateBrand(id: number, brand: any) {
    return this.http.post(`${environment.apiBase}/Catalogo/updateBrand/${id}`, brand, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });
  }

  createBrand(name: any) {
    return this.http.post(`${environment.apiBase}/Catalogo/brands`, name, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });
  }

  getBrands() {
    return this.http.get<any>(`${environment.apiBase}/Catalogo/brands`, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });
  }

  createModel(payload: any) {
    return this.http.post(`${environment.apiBase}/Catalogo/brands/models`, payload, {
      headers: { Authorization: `Bearer ${this.token}` }
    });
  }

  updateModel(modelId: number, payload: any) {
    return this.http.put(`${environment.apiBase}/Catalogo/models/${modelId}`, payload, {
      headers: { Authorization: `Bearer ${this.token}` }
    });
  }

  createVehicle(payload: any) {
    return this.http.post(`${environment.apiBase}/Vehicle`, payload, {
      headers: { Authorization: `Bearer ${this.token}` }
    });
  }

  updateVehicle(id: number, payload: any) {
    return this.http.put(`${environment.apiBase}/Vehicle/${id}`, payload, {
      headers: { Authorization: `Bearer ${this.token}` }
    });
  }

  getVehicles() {
    return this.http.get(`${environment.apiBase}/Vehicle`, {
      headers: { Authorization: `Bearer ${this.token}` }
    });
  }


}
