import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardOverviewComponent } from './dashboard/views/overview/dashboard-overview.component';
import { DashboardSucursalesComponent } from './dashboard/views/sucursales/dashboard-sucursales.component';
import { SucursalesDetailsComponent } from './dashboard/views/sucursales/details/sucursales-details.component';
import { IndiceCamarerosComponent } from './dashboard/views/indice-camareros/indice-camareros.component';

// Security
import { AuthGuardService } from './services/auth-guard.service';
import { LoginGuardService } from './services/login-guard.service';

export const router: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent, canActivate: [LoginGuardService]},
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardService],
  children: [
    {path: '', redirectTo: 'overview', pathMatch: 'full'},
    {path: 'overview', component: DashboardOverviewComponent},
    {path: 'sucursales', component: DashboardSucursalesComponent},
    {path: 'sucursales/:id', component: SucursalesDetailsComponent},
    {path: 'camareros/:id', component: IndiceCamarerosComponent},
  ]},
  {path: '**', redirectTo: 'login', pathMatch: 'full'}, // All other Routes
];

export const AppRoutes: ModuleWithProviders = RouterModule.forRoot(router, {
    useHash: true
});
