import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IDiscountResponse } from 'src/app/shared/interfaces/discount.interface';
import { DiscountService } from 'src/app/shared/services/discount/discount.service';

@Component({
  selector: 'app-discount-info',
  templateUrl: './discount-info.component.html',
  styleUrls: ['./discount-info.component.css'],
})
export class DiscountInfoComponent implements OnInit {
  public currentDiscount!: IDiscountResponse;

  constructor(private discountService: DiscountService) {}

  ngOnInit(): void {
    this.currentDiscount = this.discountService.currentDiscount;
  }
}
