import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FacturacionService {

  token: string | null = null;
  tokenDecolect: string | null = null;

  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('auth_token');
    this.tokenDecolect = environment.tokenDecolect;
  }

  getItems() {
    return this.http.get<any[]>(`${environment.apiBase}/facturacion/items/by-establishment`, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });
  }

  getChildren() {
    return this.http.get<any[]>(`${environment.apiBase}/Client/childrenByClient`, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });
  }

  consultarDecolect(numero: string, tipo: string) {
    return this.http.get<any>(`${environment.apiBase}/Facturacion/documento/${numero}?tipo=${tipo}`, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });
  }

  registrarVenta(data: any) {
    return this.http.post(`${environment.apiBase}/facturacion/registrar-venta`, data, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });
  }

  listarVentas() {
    return this.http.get<any[]>(`${environment.apiBase}/facturacion/listar`, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });
  }

  getSeries() {
    return this.http.get<any[]>(`${environment.apiBase}/facturacion/series`, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });
  }
}
