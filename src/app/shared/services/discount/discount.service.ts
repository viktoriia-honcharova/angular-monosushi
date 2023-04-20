import { Injectable } from '@angular/core';
import {
  IDiscountRequest,
  IDiscountResponse,
} from '../../interfaces/discount.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IProductResponse } from '../../interfaces/product.interface';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class DiscountService implements Resolve<IProductResponse> {
  public discounts!: IDiscountResponse[];
  private url = environment.BACKEND_URL;
  private api = { discounts: `${this.url}discounts` };

  constructor(private http: HttpClient) {}

  getAll(): Observable<IDiscountResponse[]> {
    return this.http.get<IDiscountResponse[]>(this.api.discounts);
  }

  getOne(id: number): Observable<IDiscountResponse> {
    return this.http.get<IDiscountResponse>(`${this.api.discounts}/${id}`);
  }

  create(discount: IDiscountRequest): Observable<IDiscountResponse> {
    return this.http.post<IDiscountResponse>(this.api.discounts, discount);
  }

  update(discount: IDiscountRequest, id: number): Observable<IDiscountRequest> {
    return this.http.patch<IDiscountResponse>(
      `${this.api.discounts}/${id}`,
      discount
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api.discounts}/${id}`);
  }

  resolve(route: ActivatedRouteSnapshot): Observable<IProductResponse> {
    return this.http.get<IProductResponse>(
      `${this.api.discounts}/${route.paramMap.get('id')}`
    );
  }
}
