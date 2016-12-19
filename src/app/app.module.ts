import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { HttpModule } from '@angular/http';

// Routes
import { AppRoutes } from './app.routes';

// Redux and ngrx
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import RootReducer from './reducers';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import * as Services from './services';

const mapValuesToArray = (obj) => Object.keys(obj).map(key => obj[key]);

const mappedServices = [...mapValuesToArray(Services)];
const Providers = [...mappedServices]
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutes,
    ReactiveFormsModule,
    StoreModule.provideStore({MainStore: RootReducer}),
    StoreDevtoolsModule.instrumentOnlyWithExtension()
  ],
  providers: Providers,
  bootstrap: [AppComponent]
})
export class AppModule { }
