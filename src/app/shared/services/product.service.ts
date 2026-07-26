import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IProduct } from '../interfaces/IProduct';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly baseURL = 'https://fakestoreapi.com';

  // GET all products
  getAll(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(`${this.baseURL}/products`);
  }

  // GET a single product by id
  getById(id: number): Observable<IProduct> {
    return this.http.get<IProduct>(`${this.baseURL}/products/${id}`);
  }

  // GET the list of category names
  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseURL}/products/categories`);
  }

  // GET all products in one category (e.g. "men's clothing")
  getByCategory(category: string): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(
      `${this.baseURL}/products/category/${encodeURIComponent(category)}`
    );
  }
}
