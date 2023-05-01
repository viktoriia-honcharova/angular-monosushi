import { Injectable } from '@angular/core';
import {
  IDiscountRequest,
  IDiscountResponse,
} from '../../interfaces/discount.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IProductResponse } from '../../interfaces/product.interface';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import {
  Firestore,
  CollectionReference,
  addDoc,
  collectionData,
  doc,
  updateDoc,
  deleteDoc,
  docData,
} from '@angular/fire/firestore';
import { DocumentData, collection } from '@firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class DiscountService {
  public discounts!: IDiscountResponse[];
  private discountCollection!: CollectionReference<DocumentData>;
  public currentDiscount!: IDiscountResponse;

  constructor(private http: HttpClient, private afs: Firestore) {
    this.discountCollection = collection(this.afs, 'discounts');
  }

  getAllFirebase() {
    return collectionData(this.discountCollection, { idField: 'id' });
  }

  getOneFirebase(id: string) {
    const discountDocumentReference = doc(this.afs, `discounts/${id}`);
    return docData(discountDocumentReference, { idField: 'id' });
  }

  createFirebase(discount: IDiscountRequest) {
    return addDoc(this.discountCollection, discount);
  }

  updateFirebase(category: IDiscountRequest, id: string) {
    const discountDocumentReference = doc(this.afs, `discounts/${id}`);
    return updateDoc(discountDocumentReference, { ...category });
  }

  deleteFirebase(id: string) {
    const discountDocumentReference = doc(this.afs, `discounts/${id}`);
    return deleteDoc(discountDocumentReference);
  }
}
