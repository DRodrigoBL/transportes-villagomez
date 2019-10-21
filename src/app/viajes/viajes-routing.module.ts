import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViajesHomeComponent } from './viajes-home/viajes-home.component';
import { NewViajeComponent } from './new-viaje/new.viaje.component';
import { EditViajesComponent } from './edit-viaje/edit.viaje.component';


const routes: Routes = [
  { path: '', component: ViajesHomeComponent },
  { path: 'new', component: NewViajeComponent },
  { path: 'edit', component: EditViajesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViajesRoutingModule {}
