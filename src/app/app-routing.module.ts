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
import { ProductService } from './shared/services/product/product.service';
import { DiscountService } from './shared/services/discount/discount.service';
import { AuthGuard } from './shared/guards/auth/auth.guard';
import { AuthorizationComponent } from './pages/authorization/authorization.component';
import { CabinetComponent } from './pages/cabinet/cabinet.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'actions', component: DiscountComponent },
  {
    path: 'actions/:id',
    component: DiscountInfoComponent,
    resolve: {
      discountInfo: DiscountService,
    },
  },
  { path: 'product-category/:category', component: ProductComponent },
  {
    path: 'product-category/:category/:id',
    component: ProductInfoComponent,
    resolve: {
      productInfo: ProductService,
    },
  },
  { path: 'dostavka-ta-oplata', component: DeliveryComponent },
  { path: 'about-us', component: AboutComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'dogovir-oferta', component: OfertaComponent },
  { path: 'auth', component: AuthorizationComponent },
  { path: 'cabinet', component: CabinetComponent, canActivate: [AuthGuard] },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
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
