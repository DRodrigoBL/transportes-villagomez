import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { TrucksService } from '../business/services/trucks.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViajesHomeComponent } from './viajes-home/viajes-home.component';
import { ViajesRoutingModule } from './viajes-routing.module';

@NgModule({
  declarations: [
    ViajesHomeComponent
  ],
  imports: [
    SharedModule,
    ViajesRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    TrucksService,
  ]
})
export class ViajesModule {}
