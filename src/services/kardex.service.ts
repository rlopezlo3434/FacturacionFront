import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KardexService {

  token: string | null = null;
  tokenDecolect: string | null = null;

  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('auth_token');
  }

  getProducts() {
    return this.http.get<any[]>(`${environment.apiBase}/kardex/by-establishment`, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });
  }

  getProductMovements(itemId: string) {
    return this.http.get<any[]>(`${environment.apiBase}/kardex/movimientos/${itemId}`, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });
  }

  agregarMovimiento(data: any): Observable<any> {
    return this.http.post(`${environment.apiBase}/kardex/movimientos`, data, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });
  }
}
