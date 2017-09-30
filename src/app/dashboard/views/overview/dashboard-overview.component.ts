import { Title } from '@angular/platform-browser'
import { Component, OnInit, AfterViewInit, OnDestroy, EventEmitter } from '@angular/core'
import { ActivatedRoute, Params, Router } from '@angular/router'

import { Store } from '@ngrx/store'
import { Observable } from 'rxjs/Observable'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Subscription } from 'rxjs/Subscription'

import * as moment from 'moment'
import compare from 'just-compare'

import { QuestionsService } from '@services/preguntas.service'

import { ActionTypes } from '@actions/auth.actions'

import { UserProfile } from '@models/userprofile'
import { AppState } from '@models/states/app'
import { AuthState } from '@models/states/auth'
import { StandardRequest } from '@models/standardRequest'
import { BasicRequest } from '@models/basicRequest'

import { merge, sum } from '@utilities/arrays'
import { updateObject } from '@utilities/objects'
import { mapPieChart, TotalPorDiaLineal } from '@utilities/respuestas'
import { gamaRegresando } from '@utilities/colors'

const today = moment()
  .unix()
  .toString()
const aWeekAgo = moment()
  .subtract(1, 'week')
  .unix()
  .toString()
const emptyResultsMessage =
  'No se ha encontrado información con esos requisitos. Cambie el filtro e intente de nuevo'

@Component({
  selector: 'app-dashboard-overview',
  templateUrl: './dashboard-overview.component.html',
  styleUrls: ['./dashboard-overview.component.scss']
})
export class OverviewComponent implements OnInit, AfterViewInit, OnDestroy {
  public userProfiles: UserProfile[]
  public currentQuery: StandardRequest

  public totalToday: BehaviorSubject<number>
  public totalGeneral: BehaviorSubject<number>
  public newContacts: BehaviorSubject<number>
  public branchIndex: BehaviorSubject<number>

  public generalSurveyError: string
  public generalSurveyData: number[]
  public generalSurveyLabels: string[]
  public generalSurveyLoading: Boolean
  public historicSurveyLoading: Boolean
  public historicSurveyError: string
  public historicSurveyLabels: string[]
  public historicSurveyData: any[]
  public branchColors: any

  private AuthState: Observable<AuthState>
  private subProfile: Subscription
  private subFetch: Subscription
  private subRoute: Subscription
  private fetchEvent: EventEmitter<any>

  constructor(
    private titleService: Title,
    private router: Router,
    private Route: ActivatedRoute,
    private preguntas: QuestionsService,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.titleService.setTitle('Resumén — Regresan.do')
    this.fetchEvent = new EventEmitter()
    this.AuthState = this.store.select('auth')

    this.subFetch = this.fetchEvent.subscribe(query => this.FetchAll(query))

    this.subProfile = this.AuthState
      .pluck('currentUser', 'Profiles')
      .subscribe((profiles: UserProfile[]) => (this.userProfiles = profiles))

    this.subRoute = this.Route.queryParams.subscribe(params => this.ApplyFilters(params))

    this.totalToday = new BehaviorSubject(0)
    this.totalGeneral = new BehaviorSubject(0)
    this.newContacts = new BehaviorSubject(0)
    this.branchIndex = new BehaviorSubject(0)

    this.generalSurveyData = []
    this.generalSurveyLabels = []
    this.historicSurveyLabels = []
    this.historicSurveyData = []

    this.branchColors = gamaRegresando()
  }
  ngAfterViewInit() {
    console.log('AfterViewInit...')
  }

  ngOnDestroy() {
    this.subProfile.unsubscribe()
    this.subFetch.unsubscribe()
  }

  public ApplyFilters(filter: Params) {
    const filterStart = filter['start']
    const filterEnd = filter['end']
    const navigate = (query: BasicRequest) => this.router.navigate([], { queryParams: query })
    const dispatch = (query: BasicRequest) => this.fetchEvent.emit(query)
    const dispatchNavigate = (query: BasicRequest) => {
      this.currentQuery = updateObject(this.currentQuery, query)
      dispatch(query)
      this.titleService.setTitle(
        `Resumén ${moment.unix(+query.start).format('MMM, D')} - ${moment
          .unix(+query.end)
          .format('MMM, D')} — Regresan.do`
      )
      navigate(query)
    }
    const applyDefault = () => dispatchNavigate({ start: aWeekAgo, end: today })
    const applyPartial = (s?: string, e?: string) => {
      let start =
        s ||
        moment
          .unix(+e)
          .subtract(1, 'week')
          .unix()
          .toString()
      let end =
        e ||
        moment
          .unix(+s)
          .add(1, 'week')
          .unix()
          .toString()
      dispatchNavigate({ start, end })
    }
    const DateFilter = {
      exists: params => params['start'] && params['end'],
      areNumeric: params => +params['start'] && +params['end'],
      isNumeric: (slice: string, params) => +params[slice],
      isUnix: date => moment.unix(date).isValid() && date
    }
    const queryParams = {
      start: DateFilter.isUnix(filterStart || undefined) || moment(filterStart).format('X'),
      end: DateFilter.isUnix(filterEnd || undefined) || moment(filterEnd).format('X')
    }
    if (compare(filter, {})) {
      applyDefault()
    } else if (!DateFilter.exists(queryParams)) {
      // If there's not an DateFilter applyed
      applyDefault()
    } else if (!DateFilter.areNumeric(queryParams)) {
      applyDefault()
    } else if (DateFilter.areNumeric(queryParams)) {
      applyPartial(queryParams.start, queryParams.end)
    } else if (
      DateFilter.isNumeric('start', queryParams) &&
      !DateFilter.isNumeric('end', queryParams)
    ) {
      applyPartial(queryParams.start)
    } else if (
      !DateFilter.isNumeric('start', queryParams) &&
      DateFilter.isNumeric('end', queryParams)
    ) {
      applyPartial(undefined, queryParams.end)
    }
  }

  public LoadGeneralSurvey(query: StandardRequest) {
    this.generalSurveyLoading = true
    this.generalSurveyError = ''
    this.preguntas
      .getAll(query)
      .map(res => res['Preguntas'].reduce(mapPieChart, [[], []]))
      .subscribe(
        data => {
          if (data[1].length) {
            this.generalSurveyLabels = data[0]
            this.generalSurveyData = data[1]
            this.generalSurveyLoading = false
          } else {
            this.generalSurveyLoading = false
            this.generalSurveyError = emptyResultsMessage
          }
        },
        error => {
          this.generalSurveyLoading = false
          if (error.status === 401) {
            this.store.dispatch({ type: ActionTypes.LOGOUT_START })
          } else {
            this.generalSurveyError = 'Error Cargando Total de Sucursales'
          }
        }
      )
  }

  public LoadHistoricSurvey(query: StandardRequest) {
    this.historicSurveyLoading = true
    this.historicSurveyError = ''

    this.preguntas
      .getTotalPorDia(query)
      .map(res =>
        TotalPorDiaLineal(
          res['Encuestas']['TotalesxSucursalxDia'].sort((prev, curr) => {
            let mp = moment(prev.Fecha)
            let mc = moment(curr.Fecha)
            return mp.isSameOrAfter(mc) ? 1 : -1
          })
        )
      )
      .subscribe(
        data => {
          if (data[1].length) {
            this.historicSurveyLabels = data[0]
            this.historicSurveyData = data[1].sort((prev, curr) => prev.label > curr.label) // The API doesn't sort this response
            this.historicSurveyLoading = false
          } else {
            this.historicSurveyLoading = false
            this.historicSurveyError = emptyResultsMessage
          }
        },
        error => {
          this.historicSurveyLoading = false
          if (error.status === 401) {
            this.store.dispatch({ type: ActionTypes.LOGOUT_START })
          } else {
            this.historicSurveyError = 'Error Cargando Historico de Encuestas'
          }
        }
      )
  }

  public LoadResumen(query: StandardRequest) {
    this.preguntas
      .getResumen(query)
      .map(res => res['Cabecera'])
      .subscribe(res => {
        if (res) {
          this.totalToday.next(res['TotalEncuestadosHoy'])
          this.totalGeneral.next(res['TotalEncuestas'])
          this.newContacts.next(res['NuevosContactos'])
          this.branchIndex.next(res['IndiceSucursal'])
        } else {
          this.totalToday.next(0)
          this.totalGeneral.next(0)
          this.newContacts.next(0)
          this.branchIndex.next(0)
        }
      })
  }

  // Private Helpers

  private FetchAll(query: StandardRequest) {
    this.currentQuery = updateObject(this.currentQuery, query)
    this.LoadGeneralSurvey(query)
    this.LoadHistoricSurvey(query)
    this.LoadResumen(query)
  }
}
