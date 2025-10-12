import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmpleadosService {

  token: string | null = null;


  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('auth_token');
  }

  getEmpleadosByEstablishment() {
    return this.http.get<any>(`${environment.apiBase}/Employee/by-establishment`, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });
  }

  updateStateEmpleado(id: number, data: boolean) {
    return this.http.post(`${environment.apiBase}/Employee/updateState/${id}`, { isActive: data }, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });
  }

  updateEmpleado(id: number, empleado: any) {
    return this.http.post(`${environment.apiBase}/Employee/updateEmployee/${id}`, empleado, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });
  }

  createEmpleado(empleado: any) {
    return this.http.post(`${environment.apiBase}/Employee`, empleado, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });
  }

}
