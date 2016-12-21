import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';

// Security
import { AuthGuardService } from './services/auth-guard.service';

export const router: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardService]},
  {path: '**', redirectTo: 'login', pathMatch: 'full'}, // All other Routes
];

export const AppRoutes: ModuleWithProviders = RouterModule.forRoot(router);
