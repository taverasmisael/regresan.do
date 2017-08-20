// @angular modules
import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http'

// Charts
import { ChartsModule } from 'ng2-charts/ng2-charts'
import { GaugeModule } from 'ng2-kw-gauge'

// Routes
import { AppRoutes } from './app.routes'

// Redux and ngrx
import { StoreModule } from '@ngrx/store'
import { StoreDevtoolsModule } from '@ngrx/store-devtools'
import { Reducers, metaReducers } from './reducers'

// Redux Side Effects
import { EffectsModule } from '@ngrx/effects'
import { AuthEffects } from './effects/auth.effects'
import { BranchEffects } from './effects/branch.effects'

// Services
import { ApiService } from './services/api.service'
import { QuestionsService } from './services/preguntas.service'
import { RespuestasService } from './services/respuestas.service'
import { UserService } from './services/user.service'
import { KpisService } from './services/kpis.service'
import { StaffService } from './services/staff.service'

// Security Services
import { AuthGuardService } from './services/auth-guard.service'
import { LoginGuardService } from './services/login-guard.service'

// Thirdparty Components
import { FlatpickrComponent } from './thirdparty/flatpickr'

// Components
import { AppComponent } from './app.component'
import { LoginComponent } from './login/login.component'
import { DashboardComponent } from './dashboard/dashboard.component'
import { NavbarComponent } from './dashboard/navbar/navbar.component'
import { HeaderComponent } from './dashboard/header/header.component'
import { OverviewComponent } from './dashboard/views/overview/dashboard-overview.component'
import { DashboardSucursalesComponent } from './dashboard/views/sucursales/dashboard-sucursales.component'
import { SucursalesDetailsComponent } from './dashboard/views/sucursales/details/sucursales-details.component'
import { SucursalesListComponent } from './dashboard/sucursales-list/sucursales-list.component'
import { ChartCardComponent } from './ui/chart-card/chart-card.component'
import { AnswersTableComponent } from './ui/answers-table/answers-table.component'
import { FilterComponent } from './ui/filter/filter.component'
import { TotalesCardComponent } from './ui/totales-card/totales-card.component'
import { TotalesContainerComponent } from './ui/totales-container/totales-container.component'
import { StaffRankingCardComponent } from './ui/staff-ranking-card/staff-ranking-card.component'
import { CardComponent } from './ui/card/card.component'
import { KpiCardComponent } from './ui/kpi-card/kpi-card.component'
import { OrderByPipe } from './thirdparty/orderby/orderby.pipe'
import { StaffIndexComponent } from './staff-index/staff-index.component'
import { ChartInLoopComponent } from './ui/chart-in-loop/chart-in-loop.component'
import { DoubleSelectComponent } from './ui/double-select/double-select.component'

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    NavbarComponent,
    HeaderComponent,
    OverviewComponent,
    DashboardSucursalesComponent,
    SucursalesDetailsComponent,
    SucursalesListComponent,
    ChartCardComponent,
    FlatpickrComponent,
    AnswersTableComponent,
    FilterComponent,
    TotalesCardComponent,
    TotalesContainerComponent,
    StaffRankingCardComponent,
    CardComponent,
    KpiCardComponent,
    OrderByPipe,
    StaffIndexComponent,
    ChartInLoopComponent,
    DoubleSelectComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutes,
    ReactiveFormsModule,
    StoreModule.forRoot(Reducers, { metaReducers }),
    StoreDevtoolsModule.instrument({ maxAge: 25 }),
    EffectsModule.forRoot([AuthEffects, BranchEffects]),
    ChartsModule,
    GaugeModule
  ],
  providers: [
    ApiService,
    AuthGuardService,
    LoginGuardService,
    UserService,
    RespuestasService,
    QuestionsService,
    KpisService,
    StaffService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
