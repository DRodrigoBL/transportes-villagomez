import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { BusinessRoutingModule } from './business-routing.module';
import { LoadsComponent } from './loads/loads.component';
import { TrucksService } from './services/trucks.service';
import { LoadsService } from './services/loads.service';

@NgModule({
  declarations: [
    LoadsComponent
  ],
  imports: [
    SharedModule,
    BusinessRoutingModule
  ],
  providers: [
    TrucksService,
    LoadsService
  ]
})
export class BusinessModule {}
