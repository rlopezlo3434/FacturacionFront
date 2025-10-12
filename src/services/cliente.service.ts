import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor(private http: HttpClient) { }

  getFacturas() {
    return this.http.get<any>(`${environment.apiBase}/Cliente/listFacturas`);
  }


}
