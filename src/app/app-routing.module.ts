import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { DiscountComponent } from './pages/discount/discount.component';
import { DiscountInfoComponent } from './pages/discount-info/discount-info.component';
import { ProductComponent } from './pages/product/product.component';
import { ProductInfoComponent } from './pages/product-info/product-info.component';
import { DeliveryComponent } from './pages/delivery/delivery.component';
import { AboutComponent } from './pages/about/about.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { OfertaComponent } from './pages/oferta/oferta.component';

import { AdminComponent } from './admin/admin.component';
import { AdminCategoryComponent } from './admin/admin-category/admin-category.component';
import { AdminProductComponent } from './admin/admin-product/admin-product.component';
import { AdminDiscountComponent } from './admin/admin-discount/admin-discount.component';
import { AdminOrderComponent } from './admin/admin-order/admin-order.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'actions', component: DiscountComponent },
  { path: 'product-category/:category', component: ProductComponent },
  { path: 'product-category/:category/:path', component: ProductInfoComponent },
  { path: 'dostavka-ta-oplata', component: DeliveryComponent },
  { path: 'about-us', component: AboutComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'dogovir-oferta', component: OfertaComponent },
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      {
        path: 'category',
        component: AdminCategoryComponent,
      },
      {
        path: 'product',
        component: AdminProductComponent,
      },
      {
        path: 'action',
        component: AdminDiscountComponent,
      },
      {
        path: 'order',
        component: AdminOrderComponent,
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'action',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
