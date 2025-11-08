import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  token: string | null = null;


  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('auth_token');
  }

  getClientesByEstablishment() {
    return this.http.get<any>(`${environment.apiBase}/Client/by-establishment`, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });
  }

  updateStateEmpleado(id: number, isActive: boolean) {
    return this.http.post(`${environment.apiBase}/Client/updateState/${id}`, { isActive }, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });
  }
  
  updateMarketing(id: number, acceptsMarketing: boolean) {
    return this.http.post(`${environment.apiBase}/Client/updateStateMarketing/${id}`, { acceptsMarketing }, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });
  }

  updateCliente(id: number, cliente: any) {
    return this.http.post(`${environment.apiBase}/Client/updateClient/${id}`, cliente, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });
  }

  createCliente(cliente: any) {
    return this.http.post(`${environment.apiBase}/Client`, cliente, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });
  }

  getChildrensByClientId(clientId: number) {
    return this.http.get<any>(`${environment.apiBase}/Client/listChildrenByClient/${clientId}`, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });
  }

  createChildren(params: any) {
    return this.http.post(`${environment.apiBase}/Client/children`, params, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });
  }
}
