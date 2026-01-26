import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServicesServiceService {

  token = localStorage.getItem('token');

  constructor(private http: HttpClient) {}

  getServices() {
    return this.http.get(`${environment.apiBase}/ServicesMaster`, {
      headers: { Authorization: `Bearer ${this.token}` }
    });
  }

  createService(payload: any) {
    return this.http.post(`${environment.apiBase}/ServicesMaster`, payload, {
      headers: { Authorization: `Bearer ${this.token}` }
    });
  }

  updateService(id: number, payload: any) {
    return this.http.put(`${environment.apiBase}/ServicesMaster/${id}`, payload, {
      headers: { Authorization: `Bearer ${this.token}` }
    });
  }
}
