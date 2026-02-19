import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CajaService {

  token: string | null = null;


  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('auth_token');
  }

  abriCaja(montoApertura: number) {
    return this.http.post(`${environment.apiBase}/caja/abrir`, { monto: montoApertura }, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });
  }

  listaCajas() {
    return this.http.get<any[]>(`${environment.apiBase}/caja/abiertas`, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });
  }

  verMovimientosCaja(cajaId: number) {
    return this.http.get<any[]>(`${environment.apiBase}/caja/detalle/${cajaId}`, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });
  }

  addMovimientoCaja(params: any) {
    return this.http.post(`${environment.apiBase}/caja/movimiento`, params, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });
  }
  cerrarCaja(params: any) {
    return this.http.post(`${environment.apiBase}/caja/cerrar`, params, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });
  }

  cajaDiario(caja: number, fecha?: string): Observable<Blob> {
    let params: any = {};

    if (fecha) {
      params.fecha = fecha;
    }

    return this.http.get(
      `${environment.apiBase}/caja/excel/${caja}`,
      {
        params,
        headers: {
          Authorization: `Bearer ${this.token}`
        },
        responseType: 'blob'
      }
    );
  }


  reporteCajaMensual(fecha: string): Observable<Blob> {
    let params: any = {};

    if (fecha) {
      params.fecha = fecha;
    }

    return this.http.get(`${environment.apiBase}/caja/excel-mensual`, {
      params,
      responseType: 'blob',
      headers: {
        Authorization: `Bearer ${this.token}`
      },
    });
  }

}
