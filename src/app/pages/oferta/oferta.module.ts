import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OfertaComponent } from './oferta.component';
import { OfertaRoutingModule } from './oferta-routing.module';

@NgModule({
  declarations: [OfertaComponent],
  imports: [CommonModule, OfertaRoutingModule],
})
export class OfertaModule {}
