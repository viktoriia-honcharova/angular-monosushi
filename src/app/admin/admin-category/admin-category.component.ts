import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-category',
  templateUrl: './admin-category.component.html',
  styleUrls: ['./admin-category.component.css'],
})
export class AdminCategoryComponent {
  public displayCategory = true;
  public categoryForm!: FormGroup;

  displayCategoryFunc(): void {
    this.displayCategory = !this.displayCategory;
  }

  addCategory(): void {}
}
