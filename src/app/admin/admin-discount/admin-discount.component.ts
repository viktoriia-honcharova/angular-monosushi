import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-discount',
  templateUrl: './admin-discount.component.html',
  styleUrls: ['./admin-discount.component.css'],
})
export class AdminDiscountComponent {
  public displayAction = true;
  public discountForm!: FormGroup;

  displayActionFunc(): void {
    this.displayAction = !this.displayAction;
  }

  addDiscount(): void {}
}
