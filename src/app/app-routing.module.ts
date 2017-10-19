import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { LoginComponent } from '@pages/login/login.component'
import { DashboardComponent } from '@pages/dashboard/dashboard.component'
import { OverviewComponent } from '@pages/overview/overview.component'
import { BranchesComponent } from '@pages/branches/branches.component'
import { BranchComponent } from '@pages/branch/branch.component'

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
      { path: 'sucursales', component: BranchesComponent },
      { path: 'sucursales/:id', component: BranchComponent }
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
