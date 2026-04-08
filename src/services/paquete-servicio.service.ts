import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaqueteServicioService {

  private api = `${environment.apiBase}/PaqueteServicio`;
  
    
  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<any[]>(this.api);
  }

  getById(id: number) {
    return this.http.get<any>(`${this.api}/${id}`);
  }

  create(data: any) {
    return this.http.post(this.api, data);
  }

  update(id: number, data: any) {
    return this.http.put(`${this.api}/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete(`${this.api}/${id}`);
  }
}
