import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IDiscountResponse } from 'src/app/shared/interfaces/discount.interface';
import { DiscountService } from 'src/app/shared/services/discount/discount.service';

@Component({
  selector: 'app-discount',
  templateUrl: './discount.component.html',
  styleUrls: ['./discount.component.css'],
})
export class DiscountComponent implements OnDestroy {
  userDiscounts: Array<IDiscountResponse> = [];
  private eventSubscription!: Subscription;

  constructor(
    private discountService: DiscountService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.eventSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.getDiscounts();
      }
    });
  }

  getDiscounts(): void {
    this.discountService.getAll().subscribe((data) => {
      this.userDiscounts = data;
    });
  }

  ngOnDestroy(): void {
    this.eventSubscription.unsubscribe();
  }
}
