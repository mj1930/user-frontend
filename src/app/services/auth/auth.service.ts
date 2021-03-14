import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  register(req) {
    return this.http.post('users/signup', req);
  }

  login(req) {
    return this.http.post('users/login', req);
  }

  getProducts(data) {
    return this.http.post('products/filter-products', data);
  }

  getCategories(body) {
    return this.http.post('category/get-all-categories', body); 
  }
}
