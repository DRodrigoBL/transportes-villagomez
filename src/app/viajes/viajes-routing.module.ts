import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViajesHomeComponent } from './viajes-home/viajes-home.component';
import { NewViajeComponent } from './new-viaje/new.viaje.component';


const routes: Routes = [
  { path: '', component: ViajesHomeComponent },
  { path: 'new', component: NewViajeComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViajesRoutingModule {}
