import { Injectable } from '@angular/core';
import {
  IProductRequest,
  IProductResponse,
} from '../../interfaces/product.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ProductService implements Resolve<IProductResponse> {
  public products!: IProductResponse[];
  private url = environment.BACKEND_URL;
  private api = { products: `${this.url}products` };

  constructor(private http: HttpClient) {}

  getAll(): Observable<IProductResponse[]> {
    return this.http.get<IProductResponse[]>(this.api.products);
  }

  getAllByCategory(name: string): Observable<IProductResponse[]> {
    return this.http.get<IProductResponse[]>(
      `${this.api.products}?category.path=${name}`
    );
  }

  getOne(id: number): Observable<IProductResponse> {
    return this.http.get<IProductResponse>(`${this.api.products}/${id}`);
  }

  create(product: IProductRequest): Observable<IProductResponse> {
    return this.http.post<IProductResponse>(this.api.products, product);
  }

  update(product: IProductRequest, id: number): Observable<IProductResponse> {
    return this.http.patch<IProductResponse>(
      `${this.api.products}/${id}`,
      product
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api.products}/${id}`);
  }

  resolve(route: ActivatedRouteSnapshot): Observable<IProductResponse> {
    return this.http.get<IProductResponse>(
      `${this.api.products}/${route.paramMap.get('id')}`
    );
  }
}
