import { ICategoryResponse } from './category.interface';

export interface IProductRequest {
  category: ICategoryResponse;
  name: string;
  path: string;
  ingredients: string;
  weight: string;
  imagePath: string;
}

export interface IProductResponse extends IProductRequest {
  id: number;
}
