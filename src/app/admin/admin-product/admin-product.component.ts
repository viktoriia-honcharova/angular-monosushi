import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  deleteObject,
  getDownloadURL,
  percentage,
  ref,
  Storage,
  uploadBytes,
  uploadBytesResumable,
} from '@angular/fire/storage';
import { IProductResponse } from 'src/app/shared/interfaces/product.interface';
import { ProductService } from 'src/app/shared/services/product/product.service';
import { ICategoryResponse } from 'src/app/shared/interfaces/category.interface';
import { CategoryService } from 'src/app/shared/services/category/category.service';

@Component({
  selector: 'app-admin-product',
  templateUrl: './admin-product.component.html',
  styleUrls: ['./admin-product.component.css'],
})
export class AdminProductComponent implements OnInit {
  public displayProduct = false;
  public productForm!: FormGroup;

  public adminProducts!: IProductResponse[];
  public adminCategories!: ICategoryResponse[];
  public editStatus = false;
  private currentProductId!: string;
  public uploadPercent!: number;
  public isUploaded = false;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private productService: ProductService,
    private storage: Storage
  ) {}

  ngOnInit(): void {
    this.getProducts();
    this.loadCategories();
    this.initProductForm();
  }

  displayProductFunc(): void {
    this.displayProduct = !this.displayProduct;
    this.adminProducts = this.productService.products;
    this.getProducts();
  }

  loadCategories(): void {
    this.categoryService.getAllFirebase().subscribe((data) => {
      this.adminCategories = data as ICategoryResponse[];
      this.productForm.patchValue({
        category: this.adminCategories[0].id,
      });
    });
  }

  initProductForm(): void {
    this.productForm = this.fb.group({
      category: [null, Validators.required],
      name: [null, Validators.required],
      path: [null, Validators.required],
      ingredients: [null],
      weight: [null, Validators.required],
      price: [null, Validators.required],
      imagePath: [null, Validators.required],
      count: [1],
    });
  }

  getProducts(): void {
    this.productService.getAllFirebase().subscribe((data) => {
      this.adminProducts = data as IProductResponse[];
    });
  }

  addProduct(): void {
    if (!this.editStatus) {
      this.productService.createFirebase(this.productForm.value).then(() => {
        this.getProducts();
      });
    } else {
      this.productService
        .updateFirebase(this.productForm.value, this.currentProductId as string)
        .then(() => {
          this.getProducts();
        });
    }
    this.editStatus = false;
    this.productForm.reset();
    this.isUploaded = false;
    this.uploadPercent = 0;
    this.displayProduct = false;
  }

  editProduct(product: IProductResponse): void {
    this.productForm.patchValue({
      category: product.category,
      name: product.name,
      path: product.path,
      ingredients: product.ingredients,
      weight: product.weight,
      price: product.price,
      imagePath: product.imagePath,
    });
    this.displayProduct = true;
    this.editStatus = true;
    this.currentProductId = product.id;
    this.isUploaded = true;
  }

  deleteProduct(product: IProductResponse): void {
    this.productService.deleteFirebase(product.id).then(() => {
      this.getProducts();
    });
  }

  upload(event: any): void {
    const file = event.target.files[0];
    this.uploadFile('images', file.name, file)
      .then((data) => {
        this.productForm.patchValue({
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
      this.productForm.patchValue({
        imagePath: null,
      });
    });
  }

  valueByControl(control: string): string {
    return this.productForm.get(control)?.value;
  }
}
