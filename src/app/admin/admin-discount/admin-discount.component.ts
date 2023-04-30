import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IDiscountResponse } from 'src/app/shared/interfaces/discount.interface';
import { DiscountService } from 'src/app/shared/services/discount/discount.service';
import {
  deleteObject,
  getDownloadURL,
  percentage,
  ref,
  Storage,
  uploadBytesResumable,
} from '@angular/fire/storage';

@Component({
  selector: 'app-admin-discount',
  templateUrl: './admin-discount.component.html',
  styleUrls: ['./admin-discount.component.css'],
})
export class AdminDiscountComponent implements OnInit {
  public displayAction = false;
  public discountForm!: FormGroup;

  public adminDiscounts!: IDiscountResponse[];
  public editStatus = false;
  private currentDiscountId = 0;
  public uploadPercent!: number;
  public isUploaded = false;

  constructor(
    private fb: FormBuilder,
    private discountService: DiscountService,
    private storage: Storage
  ) {}

  ngOnInit(): void {
    this.getDiscounts();
    this.initDiscountForm();
  }

  displayActionFunc(): void {
    this.displayAction = !this.displayAction;
    this.adminDiscounts = this.discountService.discounts;
    this.getDiscounts();
  }

  initDiscountForm(): void {
    this.discountForm = this.fb.group({
      imagePath: [
        'https://la.ua/wp-content/uploads/2021/06/menu-icon-2.svg',
        Validators.required,
      ],
      name: [null, Validators.required],
      title: [null, Validators.required],
      description: [null, Validators.required],
    });
  }

  getDiscounts(): void {
    this.discountService.getAll().subscribe((data) => {
      this.adminDiscounts = data;
    });
  }

  addDiscount(): void {
    if (!this.editStatus) {
      this.discountService.create(this.discountForm.value).subscribe(() => {
        this.getDiscounts();
      });
    } else {
      this.discountService
        .update(this.discountForm.value, this.currentDiscountId)
        .subscribe(() => {
          this.getDiscounts();
        });
    }
    this.editStatus = false;
    this.discountForm.reset();
    this.isUploaded = false;
    this.uploadPercent = 0;
    this.displayAction = false;
  }

  editDiscount(discount: IDiscountResponse): void {
    this.discountForm.patchValue({
      imagePath: discount.imagePath,
      name: discount.name,
      title: discount.title,
      description: discount.description,
    });
    this.displayAction = true;
    this.editStatus = true;
    this.currentDiscountId = discount.id;
    this.isUploaded = true;
  }

  deleteDiscount(discount: IDiscountResponse): void {
    this.discountService.delete(discount.id).subscribe(() => {
      this.getDiscounts();
    });
  }

  upload(event: any): void {
    const file = event.target.files[0];
    this.uploadFile('images', file.name, file)
      .then((data) => {
        this.discountForm.patchValue({
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
      this.discountForm.patchValue({
        imagePath: null,
      });
    });
  }

  valueByControl(control: string): string {
    return this.discountForm.get(control)?.value;
  }
}
