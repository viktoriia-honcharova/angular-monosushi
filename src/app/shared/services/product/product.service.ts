import { Injectable } from '@angular/core';
import {
  IProductRequest,
  IProductResponse,
} from '../../interfaces/product.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
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
  getDocs,
  onSnapshot,
} from '@angular/fire/firestore';
import { DocumentData, collection, query, where } from '@firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  public products!: IProductResponse[];
  private url = environment.BACKEND_URL;
  private api = { products: `${this.url}products` };
  private productCollection!: CollectionReference<DocumentData>;
  public productCategoryCollection!: IProductResponse[];
  public currentProduct!: IProductResponse;
  public currentCategory!: string;

  constructor(private http: HttpClient, private afs: Firestore) {
    this.productCollection = collection(this.afs, 'products');
  }

  getAllFirebase() {
    return collectionData(this.productCollection, { idField: 'id' });
  }

  async getAllByCategoryFirebase(name: string) {
    const q = query(this.productCollection, where('category.path', '==', name));
    const querySnapshot = await getDocs(q);
    this.productCategoryCollection = querySnapshot.docs.map((doc) =>
      doc.data()
    ) as IProductResponse[];
  }

  createFirebase(product: IProductRequest) {
    return addDoc(this.productCollection, product);
  }

  getOneFirebase(id: string) {
    const productDocumentReference = doc(this.afs, `products/${id}`);
    return docData(productDocumentReference, { idField: 'id' });
  }

  updateFirebase(product: IProductRequest, id: string) {
    const productDocumentReference = doc(this.afs, `products/${id}`);
    return updateDoc(productDocumentReference, { ...product });
  }

  deleteFirebase(id: string) {
    const productDocumentReference = doc(this.afs, `products/${id}`);
    return deleteDoc(productDocumentReference);
  }
}
