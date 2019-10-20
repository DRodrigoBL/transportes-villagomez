import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { BusinessRoutingModule } from './business-routing.module';
import { LoadsComponent } from './loads/loads.component';
import { TrucksService } from './services/trucks.service';
import { LoadsService } from './services/loads.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewLoadComponent } from './loads/new-load/new-load.component';
import { EditLoadComponent } from './loads/edit-load/edit-load.component';
import { CargaDetailsComponent } from './loads/carga-details/carga-details.component';
import { CargaVermasComponent } from './loads/carga-vermas/carga-vermas.component';

@NgModule({
  declarations: [
    LoadsComponent,
    NewLoadComponent,
    EditLoadComponent,
    CargaDetailsComponent,
    CargaVermasComponent
  ],
  imports: [
    SharedModule,
    BusinessRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    TrucksService,
    LoadsService
  ]
})
export class BusinessModule {}
