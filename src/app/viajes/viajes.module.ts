import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { TrucksService } from '../business/services/trucks.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViajesHomeComponent } from './viajes-home/viajes-home.component';
import { ViajesRoutingModule } from './viajes-routing.module';
import { ViajeDetailsComponent } from './viaje-details/viaje-details.component';
import { NewViajeComponent } from './new-viaje/new.viaje.component';
import { LoadsService } from '../business/services/loads.service';

@NgModule({
  declarations: [
    ViajeDetailsComponent,
    NewViajeComponent,
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
    LoadsService
  ]
})
export class ViajesModule {}
