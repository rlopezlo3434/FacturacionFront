import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  token: string | null = null;

  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('auth_token');
  }

  getVentasMensuales(fecha: string): Observable<any> {
    return this.http.get<any>(`${environment.apiBase}/dashboard/ventas-mensuales`, {
      headers: {
        Authorization: `Bearer ${this.token}`
      },
      params: {
        fecha: fecha
      },
    });
  }

  getServiciosMensuales(fecha: string): Observable<any> {
    return this.http.get<any>(`${environment.apiBase}/dashboard/servicios-mensuales`, {
      headers: {
        Authorization: `Bearer ${this.token}`
      },
      params: {
        fecha: fecha
      },
    });
  }

  getTopServiciosDia(fecha: string) {
    return this.http.get<any>(`${environment.apiBase}/dashboard/top-servicios-dia`, {headers: {
        Authorization: `Bearer ${this.token}`
      }, params: { fecha } });
  }

  getTopServiciosMes(fecha: string) {
    return this.http.get<any>(`${environment.apiBase}/dashboard/top-servicios-mes`, {headers: {
        Authorization: `Bearer ${this.token}`
      }, params: { fecha } });
  }

  getTopServiciosDiaCantidad(fecha: string) {
    return this.http.get<any>(`${environment.apiBase}/dashboard/top-servicios-dia-cantidad`, {headers: {
        Authorization: `Bearer ${this.token}`
      }, params: { fecha } });
  }

  getTopServiciosMesCantidad(fecha: string) {
    return this.http.get<any>(`${environment.apiBase}/dashboard/top-servicios-mes-cantidad`, {headers: {
        Authorization: `Bearer ${this.token}`
      }, params: { fecha } });
  }

  getComparativoMensual(fecha: string) {
    return this.http.get<any>(`${environment.apiBase}/dashboard/comparativo-mensual`, {headers: {
        Authorization: `Bearer ${this.token}`
      },
      params: { fecha }
    });
  }

  comparativoDiario(fecha: string) {
    return this.http.get<any>(
      `${environment.apiBase}/dashboard/comparativo-diario-circle`, {headers: {
        Authorization: `Bearer ${this.token}`
      }, params: { fecha } }
    );
  }

  comparativoMensual(fecha: string) {
    return this.http.get<any>(
      `${environment.apiBase}/dashboard/comparativo-mensual-circle`, {headers: {
        Authorization: `Bearer ${this.token}`
      }, params: { fecha } }
    );
  }

  getProductividadPersonal(fecha: string) {
    return this.http.get<any[]>(
      `${environment.apiBase}/dashboard/productividad-personal`,
      {headers: {
        Authorization: `Bearer ${this.token}`
      }, params: { fecha } }
    );
  }

  contribucionEstilistaDia(fecha: string) {
  return this.http.get<any[]>(
    `${environment.apiBase}/dashboard/contribucion-estilista-dia`,
    {headers: {
        Authorization: `Bearer ${this.token}`
      }, params: { fecha } }
  );
}

contribucionEstilistaMes(fecha: string) {
  return this.http.get<any[]>(
    `${environment.apiBase}/dashboard/contribucion-estilista-mes`,
    { headers: {
        Authorization: `Bearer ${this.token}`
      },params: { fecha } }
  );
}

}
