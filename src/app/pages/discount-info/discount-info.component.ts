import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IDiscountResponse } from 'src/app/shared/interfaces/discount.interface';

@Component({
  selector: 'app-discount-info',
  templateUrl: './discount-info.component.html',
  styleUrls: ['./discount-info.component.css'],
})
export class DiscountInfoComponent implements OnInit {
  public currentDiscount!: IDiscountResponse;

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.currentDiscount = response.discountInfo;
    });
  }
}
