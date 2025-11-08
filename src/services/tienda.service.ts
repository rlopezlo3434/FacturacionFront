import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TiendaService {

  token: string | null = null;

  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('auth_token');
  }

  getEstablishment() {
    return this.http.get<any>(`${environment.apiBase}/Establishment`, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });
  }
}
