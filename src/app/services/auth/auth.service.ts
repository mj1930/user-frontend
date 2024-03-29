import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  productCount = new BehaviorSubject('');
  productId = new BehaviorSubject('');
  orderAmount = new BehaviorSubject(0);
  order = new BehaviorSubject(null);
  productData = new BehaviorSubject([]);
  totalPrice = new BehaviorSubject(0);
  totalMrp = new BehaviorSubject(0);
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

  removeCartOrder() {
    return this.http.get('carts/remove-cart-order');
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

  getProductByColor(payload) {
    return this.http.post('products/get-products-by-color', payload);
  }

  getProductByRating(payload) {
    return this.http.post('products/get-products-by-rating', payload);
  }

  getProductByLocation(payload) {
    return this.http.post(`products/get-products-by-city`, payload)
  }

  getProductRating(id) {
    return this.http.get(`rating/get-product-rating/${id}`);
  }

  getRelatedProduct(obj) {
    return this.http.post(`products/get-related-products`, obj);
  }

  getVinProducts(vin) {
    return this.http.post(`products/get-vin-products`, { vin });
  }
  
  getHomeProducts() {
    return this.http.get(`products/get-home-products`);
  }

  getProductsCity(body) {
    return this.http.post('products/get-products', body);
  }

  getInvoiceDetails(id) {
    return this.http.get(`orders/print-invoice/${id}`);
  }
}
