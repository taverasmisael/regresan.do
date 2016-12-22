import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { HttpModule } from '@angular/http';

// Routes
import { AppRoutes } from './app.routes';

// Redux and ngrx
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { RootReducer } from './reducers';

// Redux Side Effects
import { EffectsModule } from '@ngrx/effects';
import { AuthEffects } from './effects/auth.effects';

import { ApiService} from './services/api.service'
import { RespuestasService} from './services/respuestas.service'
import { AuthGuardService} from './services/auth-guard.service'
import { LocalStorageService } from './services/localstorage.service'
import { UserService} from './services/user.service';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardNavbarComponent } from './dashboard/navbar/navbar.component';
import { DashboardHeaderComponent } from './dashboard/header/header.component';
import { DashboardOverviewComponent } from './dashboard/views/overview/dashboard-overview.component';
import { DashboardSucursalesComponent } from './dashboard/views/sucursales/dashboard-sucursales.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    DashboardNavbarComponent,
    DashboardHeaderComponent,
    DashboardOverviewComponent,
    DashboardSucursalesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutes,
    ReactiveFormsModule,
    StoreModule.provideStore({MainStore: RootReducer}),
    StoreDevtoolsModule.instrumentOnlyWithExtension(),
    EffectsModule.run(AuthEffects)
  ],
  providers: [
    ApiService,
    AuthGuardService,
    LocalStorageService,
    UserService,
    RespuestasService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
