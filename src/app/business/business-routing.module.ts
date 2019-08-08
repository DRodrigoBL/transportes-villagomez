import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoadsComponent } from './loads/loads.component';
import { NewLoadComponent } from './loads/new-load/new-load.component';
import { EditLoadComponent } from './loads/edit-load/edit-load.component';

const routes: Routes = [
  { path: '', component: LoadsComponent },
  { path: 'new', component: NewLoadComponent },
  { path: 'edit', component: EditLoadComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessRoutingModule {}
