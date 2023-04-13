import { Component, OnInit } from '@angular/core';
import { IProductResponse } from 'src/app/shared/interfaces/product.interface';
import { ProductService } from 'src/app/shared/services/product/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  public userProducts!: IProductResponse[];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    this.productService.getAll().subscribe((data) => {
      this.userProducts = data;
    });
  }
}
