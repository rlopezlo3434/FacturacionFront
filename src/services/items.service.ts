import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Item } from '../app/Models/Item';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {

  token: string | null = null;

  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('auth_token');
  }

  postItems(items: any) {
    return this.http.post(`${environment.apiBase}/Item`, items, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });
  }

  getItemsByEstablishment() {
    return this.http.get<Item[]>(`${environment.apiBase}/Item/items-by-establishment`, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });
  }

  updateStateItem(id: number, data: boolean) {
    return this.http.post(`${environment.apiBase}/Item/updateState/${id}`, { isActive: data }, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });
  }

  updateItem(data: any) {
    return this.http.post(`${environment.apiBase}/Item/updateItem`, data, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });
  }

}
