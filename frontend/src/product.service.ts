import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ProductCategory } from './app.models';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly api = 'http://localhost:3001/api';

  products(category?: ProductCategory): Observable<Product[]> {
    const query = category ? `?category=${category}` : '';
    return this.http.get<Product[]>(`${this.api}/products${query}`);
  }

  adminProducts(token: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.api}/admin/products`, { headers: this.authHeaders(token) });
  }

  login(email: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.api}/login`, { email, password });
  }

  create(product: Omit<Product, 'id'>, token: string): Observable<Product> {
    return this.http.post<Product>(`${this.api}/admin/products`, product, { headers: this.authHeaders(token) });
  }

  update(id: string | number, product: Omit<Product, 'id'>, token: string): Observable<Product> {
    return this.http.put<Product>(`${this.api}/admin/products/${id}`, product, { headers: this.authHeaders(token) });
  }

  remove(id: string | number, token: string): Observable<{ deleted: boolean }> {
    return this.http.delete<{ deleted: boolean }>(`${this.api}/admin/products/${id}`, { headers: this.authHeaders(token) });
  }

  checkout(customerName: string, customerEmail: string, items: { productId: string | number; quantity: number }[]): Observable<unknown> {
    return this.http.post(`${this.api}/checkout`, { customerName, customerEmail, items });
  }

  private authHeaders(token: string): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }
}
