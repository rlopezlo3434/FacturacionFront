import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

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

  reporteDiario(fecha: string): Observable<Blob> {
    return this.http.get(`${environment.apiBase}/facturacion/reporte-diario2`, {
      headers: {
        Authorization: `Bearer ${this.token}`
      },
      params: {
        fecha: fecha
      },
      responseType: 'blob' 
    });
  }

  obtenerProductividad(): Observable<Blob> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });
    return this.http.get(`${environment.apiBase}/facturacion/reporte-productividad`, {
      headers,
      responseType: 'blob'
    });
  }

  descargarPDF(url: string): Observable<Blob> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });
    return this.http.get(`${environment.apiBase}/facturacion/descargar-pdf?url=${encodeURIComponent(url)}`, {
      headers,
      responseType: 'blob'
    });
  }

  listarVentas(fecha: string) {
    return this.http.get<any[]>(`${environment.apiBase}/facturacion/listar`, {
      headers: {
        Authorization: `Bearer ${this.token}`
      },
      params: {
        fecha: fecha
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

  anularComprobante(id: number) {
    return this.http.post<any>(`${environment.apiBase}/facturacion/anular/${id}`, {}, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });
  }

  imprimirPdf(url: string): Observable<Blob> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    // Envías la URL al backend (asegúrate de que el endpoint la reciba como query param o body)
    return this.http.get(`${environment.apiBase}/facturacion/pdf/print?url=${encodeURIComponent(url)}`, {
      headers,
      responseType: 'blob'
    });
  }

  descuentosCliente(numeroDocumento: string) {
    return this.http.get<any[]>(`${environment.apiBase}/client/cliente/${numeroDocumento}`, {
      headers: {
        Authorization: `Bearer ${this.token}`
      },
      params: {
        numeroDocumento: numeroDocumento
      }
    });
  }
}
