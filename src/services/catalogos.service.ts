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

  updateBrandState(id: number, brand: { name: string; isActive: boolean }) {
    return this.http.post<any>(`${environment.apiBase}/Catalogo/updateBrand/${id}`, brand, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });
  }
  
  getModelsByBrand(brandId: number) {
    return this.http.get<any>(`${environment.apiBase}/Catalogo/brands/${brandId}/models`, {});
  }

  updateModelState(modelId: number, model: { isActive: boolean; brandId: number }) {
    return this.http.post<any>(`${environment.apiBase}/Catalogo/models/${modelId}`, model, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });
  }

  getUnitMeasure() {
    return this.http.get<any>(`${environment.apiBase}/Catalogo/unit-measures`, {});
  }
  
}
