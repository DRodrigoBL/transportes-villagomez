import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { BusinessRoutingModule } from './business-routing.module';
import { LoadsComponent } from './loads/loads.component';

@NgModule({
  declarations: [
    LoadsComponent
  ],
  imports: [
    SharedModule,
    BusinessRoutingModule
  ]
})
export class BusinessModule {}
