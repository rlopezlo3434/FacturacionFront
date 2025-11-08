import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PromocionesService {

  token: string | null = null;

  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('auth_token');
  }

  getPromociones() {
    return this.http.get<any[]>(`${environment.apiBase}/Promotion`, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });
  }

  createPromocion(data: any) {
    return this.http.post(`${environment.apiBase}/Promotion`, data, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });
  }

  updatePromocion(id: number, data: any) {
    return this.http.post(`${environment.apiBase}/Promotion/${id}`, data, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });
  }
}
