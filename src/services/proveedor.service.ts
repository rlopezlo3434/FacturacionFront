import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

  private api = `${environment.apiBase}/proveedor`;

  constructor(private http: HttpClient) { }

  getProveedores() {
    return this.http.get<any[]>(this.api);
  }

  createProveedor(data: any) {
    return this.http.post(this.api, data);
  }

  updateProveedor(id: number, data: any) {
    return this.http.put(`${this.api}/${id}`, data);
  }

  deleteProveedor(id: number) {
    return this.http.delete(`${this.api}/${id}`);
  }
}
