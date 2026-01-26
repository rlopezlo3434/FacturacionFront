import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  token = localStorage.getItem('token');

  constructor(private http: HttpClient) {}

  getProducts() {
    return this.http.get(`${environment.apiBase}/Product`, {
      headers: { Authorization: `Bearer ${this.token}` }
    });
  }

  createProduct(payload: any) {
    return this.http.post(`${environment.apiBase}/Product`, payload, {
      headers: { Authorization: `Bearer ${this.token}` }
    });
  }

  updateProduct(id: number, payload: any) {
    return this.http.put(`${environment.apiBase}/Product/${id}`, payload, {
      headers: { Authorization: `Bearer ${this.token}` }
    });
  }
}
