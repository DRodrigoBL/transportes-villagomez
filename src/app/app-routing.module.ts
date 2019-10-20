import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { WelcomeComponent } from './welcome/welcome.component';

const routes: Routes = [
  // { path: '', component: WelcomeComponent },
  {
    path: 'cargas',
    loadChildren: './business/business.module#BusinessModule',
    canLoad: [AuthGuard]
  },
  {
    path: 'viajes',
    loadChildren: './viajes/viajes.module#ViajesModule',
    canLoad: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
