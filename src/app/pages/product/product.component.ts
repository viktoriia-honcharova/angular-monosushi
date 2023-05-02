import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IProductResponse } from 'src/app/shared/interfaces/product.interface';
import { ProductService } from 'src/app/shared/services/product/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit, OnDestroy {
  public userProducts!: IProductResponse[];
  private eventSubscription!: Subscription;

  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.eventSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.getProducts();
      }
    });
  }

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    const categoryName = this.activatedRoute.snapshot.paramMap.get(
      'category'
    ) as string;
    this.productService.getAllByCategoryFirebase(categoryName);
    this.userProducts = this.productService
      .productCategoryCollection as IProductResponse[];
  }

  ngOnDestroy(): void {
    this.eventSubscription.unsubscribe();
  }

  learnMore(product: IProductResponse) {
    this.productService.currentProduct = product;
  }
}
