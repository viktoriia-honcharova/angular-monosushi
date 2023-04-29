import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CabinetComponent } from './cabinet.component';
import { PersonalDataComponent } from './personal-data/personal-data.component';
import { OrdersHistoryComponent } from './orders-history/orders-history.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

const routes: Routes = [
  {
    path: '',
    component: CabinetComponent,
    children: [
      {
        path: 'personal-data',
        component: PersonalDataComponent,
      },
      {
        path: 'orders-history',
        component: OrdersHistoryComponent,
      },
      {
        path: 'change-password',
        component: ChangePasswordComponent,
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'personal-data',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CabinetRoutingModule {}
