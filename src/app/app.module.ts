// @angular modules
import { BrowserModule, Title } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http'

// Charts
import { ChartsModule } from 'ng2-charts/ng2-charts'
import { GaugeModule } from 'ng-gauge'
import { AgGridModule } from 'ag-grid-angular/main'

// Routes
import { AppRoutingModule } from './app-routing.module'

// Redux and ngrx
import { StoreModule } from '@ngrx/store'
import { StoreDevtoolsModule } from '@ngrx/store-devtools'
import { Reducers, metaReducers } from '@reducers/index'

// Redux Side Effects
import { EffectsModule } from '@ngrx/effects'
import { AuthEffects } from '@effects/auth.effects'
import { BranchEffects } from '@effects/branch.effects'

// Services
import { ApiService } from '@services/api.service'
import { QuestionsService } from '@services/preguntas.service'
import { RespuestasService } from '@services/respuestas.service'
import { UserService } from '@services/user.service'
import { KpisService } from '@services/kpis.service'
import { StaffService } from '@services/staff.service'

// Security Services
import { AuthGuardService } from '@services/auth-guard.service'
import { LoginGuardService } from '@services/login-guard.service'

// Thirdparty Components
import { FlatpickrComponent } from '@thirdparty/flatpickr'

// Components
import { AppComponent } from '@app/app.component'
import { LoginComponent } from '@pages/login/login.component'
import { DashboardComponent } from '@pages/dashboard/dashboard.component'
import { NavbarComponent } from '@components/navbar/navbar.component'
import { HeaderComponent } from '@components/header/header.component'
import { OverviewComponent } from '@pages/overview/dashboard-overview.component'
import { DashboardSucursalesComponent } from '@pages/sucursales/dashboard-sucursales.component'
import { SucursalesDetailsComponent } from '@pages/sucursales/details/sucursales-details.component'
import { SucursalesListComponent } from '@components/sucursales-list/sucursales-list.component'
import { ChartCardComponent } from '@components/chart-card/chart-card.component'
import { AnswersTableComponent } from '@components/answers-table/answers-table.component'
import { FilterComponent } from '@components/filter/filter.component'
import { TotalesCardComponent } from '@components/totales-card/totales-card.component'
import { TotalesContainerComponent } from '@components/totales-container/totales-container.component'
import { StaffRankingCardComponent } from '@components/staff-ranking-card/staff-ranking-card.component'
import { CardComponent } from '@components/card/card.component'
import { KpiCardComponent } from '@components/kpi-card/kpi-card.component'
import { OrderByPipe } from '@thirdparty/orderby/orderby.pipe'
import { StaffIndexComponent } from '@components/staff-index/staff-index.component'
import { ChartInLoopComponent } from '@components/chart-in-loop/chart-in-loop.component'
import { DoubleSelectComponent } from '@components/double-select/double-select.component'
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
    AppRoutingModule,
    ReactiveFormsModule,
    StoreModule.forRoot(Reducers, { metaReducers }),
    StoreDevtoolsModule.instrument({ maxAge: 25 }),
    EffectsModule.forRoot([AuthEffects, BranchEffects]),
    ChartsModule,
    GaugeModule,
    AgGridModule
  ],
  providers: [
    Title,
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
