import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CabinetComponent } from './cabinet.component';
import { PersonalDataComponent } from './personal-data/personal-data.component';
import { OrdersHistoryComponent } from './orders-history/orders-history.component';
import { CabinetRoutingModule } from './cabinet-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    CabinetComponent,
    PersonalDataComponent,
    OrdersHistoryComponent,
  ],
  imports: [CommonModule, CabinetRoutingModule, SharedModule],
})
export class CabinetModule {}
