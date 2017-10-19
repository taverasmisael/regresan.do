import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { LoginComponent } from '@pages/login/login.component'
import { DashboardComponent } from '@pages/dashboard/dashboard.component'
import { OverviewComponent } from '@pages/overview/dashboard-overview.component'
import { DashboardSucursalesComponent } from '@pages/sucursales/dashboard-sucursales.component'
import { SucursalesDetailsComponent } from '@pages/sucursales/details/sucursales-details.component'

// Security
import { AuthGuardService } from '@services/auth-guard.service'
import { LoginGuardService } from '@services/login-guard.service'

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [LoginGuardService] },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuardService],
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: OverviewComponent },
      { path: 'sucursales', component: DashboardSucursalesComponent },
      { path: 'sucursales/:id', component: SucursalesDetailsComponent }
    ]
  },
  { path: '**', redirectTo: 'login', pathMatch: 'full' } // All other Routes
]

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule {}
