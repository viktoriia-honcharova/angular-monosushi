import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IDiscountResponse } from 'src/app/shared/interfaces/discount.interface';
import { CategoryService } from 'src/app/shared/services/category/category.service';
import {
  deleteObject,
  getDownloadURL,
  percentage,
  ref,
  Storage,
  uploadBytes,
  uploadBytesResumable,
} from '@angular/fire/storage';
import { ICategoryResponse } from 'src/app/shared/interfaces/category.interface';

@Component({
  selector: 'app-admin-category',
  templateUrl: './admin-category.component.html',
  styleUrls: ['./admin-category.component.css'],
})
export class AdminCategoryComponent implements OnInit {
  public displayCategory = false;
  public categoryForm!: FormGroup;

  public adminCategories!: ICategoryResponse[];
  public editStatus = false;
  private currentCategoryId = 0;
  public uploadPercent!: number;
  public isUploaded = false;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private storage: Storage
  ) {}

  ngOnInit(): void {
    this.getCategories();
    this.initCategoryForm();
  }

  displayCategoryFunc(): void {
    this.displayCategory = !this.displayCategory;
  }

  initCategoryForm(): void {
    this.categoryForm = this.fb.group({
      name: [null, Validators.required],
      path: [null, Validators.required],
      imagePath: [null, Validators.required],
    });
  }

  getCategories(): void {
    this.categoryService.getAll().subscribe((data) => {
      this.adminCategories = data;
    });
  }

  addCategory(): void {
    if (!this.editStatus) {
      this.categoryService.create(this.categoryForm.value).subscribe(() => {
        this.getCategories();
      });
    } else {
      this.categoryService
        .update(this.categoryForm.value, this.currentCategoryId)
        .subscribe(() => {
          this.getCategories();
        });
    }
    this.editStatus = false;
    this.categoryForm.reset();
    this.isUploaded = false;
    this.uploadPercent = 0;
  }

  editCategory(category: ICategoryResponse): void {
    this.categoryForm.patchValue({
      name: category.name,
      path: category.path,
      imagePath: category.imagePath,
    });
    this.editStatus = true;
    this.currentCategoryId = category.id;
    this.isUploaded = true;
  }

  deleteCategory(discount: ICategoryResponse): void {
    this.categoryService.delete(discount.id).subscribe(() => {
      this.getCategories();
    });
  }

  upload(event: any): void {
    const file = event.target.files[0];
    this.uploadFile('images', file.name, file)
      .then((data) => {
        this.categoryForm.patchValue({
          imagePath: data,
        });
        this.isUploaded = true;
      })
      .catch((err) => {
        console.error(err);
      });
  }

  async uploadFile(
    folder: string,
    name: string,
    file: File | null
  ): Promise<string> {
    const path = `${folder}/${name}`;
    let url = '';
    if (file) {
      try {
        const storageRef = ref(this.storage, path);
        const task = uploadBytesResumable(storageRef, file);
        percentage(task).subscribe((data) => {
          this.uploadPercent = data.progress;
        });
        await task;
        url = await getDownloadURL(storageRef);
      } catch (e: any) {
        console.error(e);
      }
    } else {
      console.log('wrong format');
    }
    return Promise.resolve(url);
  }

  deleteImage(): void {
    const task = ref(this.storage, this.valueByControl('imagePath'));
    deleteObject(task).then(() => {
      this.isUploaded = false;
      this.uploadPercent = 0;
      this.categoryForm.patchValue({
        imagePath: null,
      });
    });
  }

  valueByControl(control: string): string {
    return this.categoryForm.get(control)?.value;
  }
}
