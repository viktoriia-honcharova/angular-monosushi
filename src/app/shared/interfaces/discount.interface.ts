export interface IDiscountRequest {
  imagePath: string;
  name: string;
  title: string;
  description: string;
}

export interface IDiscountResponse extends IDiscountRequest {
  id: number;
}
