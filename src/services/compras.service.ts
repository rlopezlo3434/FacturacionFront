import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class ComprasService {

  private get headers() {
    return { Authorization: `Bearer ${localStorage.getItem('auth_token')}` };
  }

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<any>(`${environment.apiBase}/Compra`, { headers: this.headers });
  }

  create(dto: any) {
    return this.http.post<any>(`${environment.apiBase}/Compra`, dto, { headers: this.headers });
  }

  getById(id: number) {
    return this.http.get<any>(`${environment.apiBase}/Compra/${id}`, { headers: this.headers });
  }

  delete(id: number) {
    return this.http.delete<any>(`${environment.apiBase}/Compra/${id}`, { headers: this.headers });
  }

  getProductos() {
    return this.http.get<any>(`${environment.apiBase}/Product`, { headers: this.headers });
  }

  getProveedores() {
    return this.http.get<any>(`${environment.apiBase}/Proveedor`, { headers: this.headers });
  }
}
