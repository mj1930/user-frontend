import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  productCount = new BehaviorSubject('');
  productId = new BehaviorSubject('');
  productData = new BehaviorSubject([]);
  totalPrice = new BehaviorSubject(0);
  constructor(private http: HttpClient) {}

  register(req) {
    return this.http.post('users/signup', req);
  }

  login(req) {
    return this.http.post('users/login', req);
  }

  getProducts(data) {
    return this.http.post('products/get-all-products', data);
  }

  getProduct(id) {
    return this.http.get(`products/get-product-by-id?productId=${id}`);
  }

  getCategories(body) {
    return this.http.post('category/get-all-categories', body);
  }

  addToCart(data) {
    return this.http.post('carts/add-cart', data);
  }

  getCartList(body) {
    return this.http.post('carts/list-cart', body);
  }

  updateCart(data) {
    return this.http.post('carts/update-quantity', data);
  }

  removeCart(data) {
    return this.http.post('carts/remove-cart', data);
  }

  getProductsByCategory(body) {
    return this.http.post('products/get-products-by-category', body);
  }

  getSortProducts(body) {
    return this.http.post('products/sort-products', body);
  }

  getOneCategory(categoryId) {
    return this.http.get(`category/get-one-category?categoryId=${categoryId}`);
  }

  getUserDetails() {
    return this.http.get(`users/get-user-details`);
  }

  searchProduct(data) {
    return this.http.get(`products/search-products?term=${data}`);
  }

  getOrders(body) {
    return this.http.post('orders/list-orders', body);
  }

  getProductsByCity(body) {
    return this.http.post('products/get-products-by-city', body);
  }

  updateNewProductToCart(payload) {
    return this.http.post('carts/update-cart', payload);
  }

  getProductByPrice(payload) {
    return this.http.post('products/get-products-by-price', payload);
  }
}
