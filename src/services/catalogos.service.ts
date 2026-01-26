import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CatalogosService {

  token: string | null = null;


  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('auth_token');
  }

  getCatalogTypeDocument() {
    return this.http.get<any>(`${environment.apiBase}/Catalogo/document-identification-types`, {});
  }

  getCatalogGender() {
    return this.http.get<any>(`${environment.apiBase}/Catalogo/gender-types`, {});
  }

  getCatalogoContactTypes() {
    return this.http.get<any>(`${environment.apiBase}/Catalogo/contact-types`, {});
  }

  getBrands() {
    return this.http.get<any>(`${environment.apiBase}/Catalogo/brands`, {});
  }
  getModelsByBrand(brandId: number) {
    return this.http.get<any>(`${environment.apiBase}/Catalogo/brands/${brandId}/models`, {});
  }
}
