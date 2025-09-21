import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {}

  login(params: any) {
    return this.http.post<any>(`${environment.apiBase}/Auth/login`, params);
  }

  setToken(token: string) {
    localStorage.setItem('auth_token', token);
  }

  
}
