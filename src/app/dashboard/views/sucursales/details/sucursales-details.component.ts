import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core'
import { ActivatedRoute, Params, Router } from '@angular/router'

import * as moment from 'moment'

import * as R from 'ramda'
const { compose, reduce, flatten, filter, length, map, prop, tap } = R

import compare from 'just-compare'

import { Store } from '@ngrx/store'
import { Observable } from 'rxjs/Observable'
import { Subscription } from 'rxjs/Subscription'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'

import { ActionTypes as AuthActions } from '@actions/auth.actions'

import { QuestionsService } from '@services/preguntas.service'
import { RespuestasService } from '@services/respuestas.service'
import { KpisService } from '@services/kpis.service'

import { createOpenAnswerEntry, makePieChart, TotalPorDiaLineal } from '@utilities/respuestas'
import { updateObject, objectRest } from '@utilities/objects'
import { merge, findByObjectId } from '@utilities/arrays'
import { ratingPalette, gamaRegresando } from '@utilities/colors'

import { APIRequestParams, APIRequestRespuesta, APIRequestUser } from '@models/apiparams'
import { AppState } from '@models/states/app'
import { BranchState } from '@models/states/branch'
import { HistoricEntry } from '@models/historicEntry'
import { OpenAnswer } from '@models/openAnswer'
import { Question } from '@models/question'
import { CloseAnswer } from '@models/closeAnswer'
import { StateRequest } from '@models/states/stateRequest'
import { UserProfile } from '@models/userProfile'
import { BranchChartData } from '@models/branchChartData'
import { ChartData } from '@models/chartData'
import { OpenAnswerData } from '@models/openAnswerData'

import { QuestionFilter } from '@models/questionFilter'

import {
  SaveInfo,
  ResetButInfo,
  ResetAll,
  RequestCloseAnswer,
  RequestHistoric,
  RequestKPI,
  RequestOpenAnswer,
  RequestQuestions,
  RequestStaffRanking,
  ApplyCurrentQuery
} from '@actions/branch.actions'

const aWeekAgo = moment().subtract(1, 'week').unix().toString()
const today = moment().unix().toString()
const unique = key => (p, c) => (p.find(e => e[key] === c[key]) ? p : [...p, c])
const uniqueQuestion = unique('idPregunta')
const uniqueQuestionInAnswer = unique('Pregunta')
const uniqueValue = unique('value')
const keyWithValue = filter(k => !!k)

@Component({
  selector: 'app-sucursales-details',
  templateUrl: './sucursales-details.component.html',
  styleUrls: ['./sucursales-details.component.scss']
})
export class SucursalesDetailsComponent implements OnInit, AfterViewInit, OnDestroy {
  public activeBranch: BranchState
  public totalToday: BehaviorSubject<number>
  public totalGeneral: BehaviorSubject<number>
  public newContacts: BehaviorSubject<number>
  public branchIndex: BehaviorSubject<number>

  public chartData: BranchChartData
  public branchColor: number

  public needsCloseAnswers: boolean
  public needsOpenAnswers: boolean
  public needsDataLabel: string

  public questionsList: Array<{
    value: number
    text: string
    children: Array<{ value: string; text: string }>
  }>

  private store$: Observable<BranchState>
  public profiles$: Observable<UserProfile[]>

  private subCloseQs: Subscription
  private subOpeneQs: Subscription
  private subBranch: Subscription
  private subRoute: Subscription
  private subHistoric: Subscription
  private subCloseAw: Subscription
  private subOpenAw: Subscription
  private subCurrentQr: Subscription

  constructor(
    private router: Router,
    private Preguntas: QuestionsService,
    private Respuestas: RespuestasService,
    KPIS: KpisService,
    private store: Store<AppState>,
    private Route: ActivatedRoute
  ) {}

  // Angular Lifecycle Hooks
  ngOnInit() {
    this.questionsList = []
    this.needsDataLabel = 'Cargar Preguntas Cerradas'
    // This update the ActiveBranch on each StoreAction
    this.store$ = this.store.select('currentBranch')

    this.chartData = new BranchChartData(new ChartData([], [], [gamaRegresando()[3]]), [], [])
    this.profiles$ = this.store.select('auth').pluck('currentUser', 'Profiles')

    this.InitializeSubscriptions()

    this.ResetResume()
  }

  ngAfterViewInit() {
    console.log('AfterViewInit...')
  }

  ngOnDestroy() {
    console.log('Destroying...')
    this.subCloseQs.unsubscribe()
    this.subOpeneQs.unsubscribe()
    this.subBranch.unsubscribe()
    this.subRoute.unsubscribe()
    this.subCloseAw.unsubscribe()
    this.subOpenAw.unsubscribe()
    this.store.dispatch(new ResetAll())
  }

  public loadAnswersCharts(event) {
    if (this.needsCloseAnswers) {
      this.needsDataLabel = 'Cargar Preguntas Abiertas'
      if (!this.needsOpenAnswers) {
        this.needsOpenAnswers = true
      }
    } else {
      const currentQuery = this.activeBranch.currentQuery
      this.needsDataLabel = 'Cargar Preguntas Abiertas'
      this.needsCloseAnswers = true
      this.FetchQuestions(currentQuery)
    }
  }

  // Public Methods
  public LoadCloseAnswer(pregunta: string) {
    const currentQuery = this.activeBranch.currentQuery
    const query = updateObject(currentQuery, { pregunta })
    this.store.dispatch(new RequestCloseAnswer(query, `Cargando Respuesta ${pregunta}`))
  }

  public LoadOpenAnswer(question: string) {
    const currentQuery = this.activeBranch.currentQuery
    const query = Object.assign(currentQuery, { question })
    this.store.dispatch(new RequestOpenAnswer(query, `Cargando Respuesta ${question}`))
  }

  public NavigateToBranch(profileId: number) {
    this.router.navigate(['../', profileId], {
      relativeTo: this.Route,
      preserveQueryParams: true,
      preserveFragment: true
    })
  }

  public LoadResumen(currentQuery) {
    this.Preguntas.getResumenSucursal(currentQuery).map(res => res['Cabecera']).subscribe(res => {
      if (res) {
        this.totalToday.next(res['TotalEncuestadosHoy'])
        this.totalGeneral.next(res['TotalEncuestas'])
        this.newContacts.next(res['NuevosContactos'])
        this.branchIndex.next(res['IndiceSucursal'])
      } else {
        this.ResetResume()
      }
    })
  }

  public FetchQuestions(currentQuery) {
    this.store.dispatch(new RequestQuestions(currentQuery, 'Cargando Preguntas...'))
  }
  public FetchKPIs(currentQuery) {
    this.store.dispatch(new RequestKPI(currentQuery, 'Cargando KPIs..'))
  }
  public FetchStaffRanking(currentQuery) {
    this.store.dispatch(new RequestStaffRanking(currentQuery, 'Cargando Ranking de Personal...'))
  }
  public FetchHistoric(currentQuery) {
    this.store.dispatch(new RequestHistoric(currentQuery, 'Cargando Histórico de Encuestas...'))
  }

  public FetchAll() {
    const currentQuery = this.activeBranch.currentQuery
    this.FetchHistoric(currentQuery)
    this.FetchKPIs(currentQuery)
    this.LoadResumen(currentQuery)
    this.FetchStaffRanking(currentQuery)
  }

  // Public Helpers
  public GetRequestAnswerInfo(type: 'ACLOSE' | 'AOPEN', qid: number): StateRequest {
    const res =
      findByObjectId<StateRequest>(this.activeBranch.requests[type], qid.toString()) ||
      new StateRequest(undefined, true, '')
    return res
  }

  public GetAnswerDisplayData(type: 'ACLOSE' | 'AOPEN', question: string): any[] {
    const result = findByObjectId<any>(this.chartData[type], question) || []
    return result // NO A REAL ERROR. JUST TYPESCRIPT CRAZINESS >:V
  }

  public ApplyQueryParams(queryParams: Params) {
    const dispatch = (query: APIRequestUser) => this.store.dispatch(new ApplyCurrentQuery(query))
    const navigate = (query: APIRequestUser) => this.router.navigate([], { queryParams: query })
    const dispatchNavigate = (query: any) => {
      dispatch(query)
      navigate(query)
      this.FetchAll()
    }
    const applyDefault = () => dispatchNavigate({ start: aWeekAgo, end: today })
    const applyPartial = (s?: string, e?: string, extra?: any) => {
      let start = s || moment.unix(+e).subtract(1, 'week').unix().toString()
      let end = e || moment.unix(+s).add(1, 'week').unix().toString()
      dispatchNavigate(updateObject({ start, end }, extra))
    }
    const DateFilter = {
      exists: params => params['start'] && params['end'],
      areNumeric: params => +params['start'] && +params['end'],
      isNumeric: (slice: string, params) => +params[slice]
    }
    const currentQuery = this.activeBranch.currentQuery
    const currentDateQuery = {
      start: currentQuery.start,
      end: currentQuery.end
    }
    const extraParams = keyWithValue(<any>objectRest(queryParams, ['start', 'end']))
    if (currentDateQuery && compare(queryParams, currentDateQuery)) {
      return
    }
    if (compare(queryParams, {})) {
      applyDefault()
    } else if (!DateFilter.exists(queryParams) || !DateFilter.areNumeric(queryParams)) {
      // If there's not an DateFilter applyed
      applyDefault()
    } else if (DateFilter.areNumeric(queryParams)) {
      applyPartial(queryParams['start'], queryParams['end'], extraParams)
    } else if (
      DateFilter.isNumeric('start', queryParams) &&
      !DateFilter.isNumeric('end', queryParams)
    ) {
      applyPartial(queryParams['start'], undefined, extraParams)
    } else if (
      !DateFilter.isNumeric('start', queryParams) &&
      DateFilter.isNumeric('end', queryParams)
    ) {
      applyPartial(undefined, queryParams['end'], extraParams)
    }
  }

  // Private Methods

  private InitializeSubscriptions() {
    this.subBranch = this.store$
      .filter(branch => !compare(branch, this.activeBranch)) // Only triggers when the sates are differents
      .subscribe(branch => {
        const areBranchs = branch && this.activeBranch
        const shouldBranchUpdate = areBranchs && !compare(branch.info, this.activeBranch.info)
        if (shouldBranchUpdate) {
          this.ResetButInfo()
        } // Only ResetButInfo if `.ifno` had changed
        this.activeBranch = branch
      })
    // Load all CloseAnswer each time there are new closeQuestions
    this.subCloseQs = this.store$
      .distinctUntilKeyChanged('closeQuestions')
      .pluck('closeQuestions')
      .filter((qs: Question[]) => Boolean(qs.length))
      .map((qs: Question[]) => qs.map(q => q.idPregunta))
      .subscribe(questionsId => questionsId.forEach(id => this.LoadCloseAnswer(id.toString())))

    // Load all OpenAnswer each time there are new openQuestions
    this.subOpeneQs = this.store$
      .distinctUntilKeyChanged('openQuestions')
      .pluck('openQuestions')
      .filter((qs: Question[]) => Boolean(qs.length))
      .map((qs: Question[]) => qs.map(q => q.idPregunta))
      .subscribe(questionsId => questionsId.forEach(id => this.LoadOpenAnswer(id.toString())))

    this.subCloseAw = this.store$
      .distinctUntilKeyChanged('closeAnswers')
      .pluck('closeAnswers')
      .filter((aws: CloseAnswer[]) => Boolean(aws.length))
      .map((aws: CloseAnswer[]) => [aws[aws.length - 1]])
      .map(aws => aws.map(makePieChart).reduce(merge, []))
      .subscribe(answers => this.SaveCloseAnswers(answers))

    this.subOpenAw = this.store$
      .distinctUntilKeyChanged('openAnswers')
      .pluck('openAnswers')
      .filter((aws: OpenAnswer[][]) => Boolean(aws.length))
      .map((aws: OpenAnswer[][]) => [aws[aws.length - 1]])
      .filter(aws => Boolean(aws[0].length))
      .map(aws => <OpenAnswerData[]>aws.map(createOpenAnswerEntry).reduce(merge, []))
      .subscribe(answers => this.SaveOpenAnswers(answers))

    this.subHistoric = this.store$
      .distinctUntilKeyChanged('historicData')
      .pluck('historicData')
      .filter((entries: HistoricEntry[]) => Boolean(entries.length))
      .map(TotalPorDiaLineal)
      .subscribe(processedEntries => this.SaveHistoricEntries(processedEntries))

    this.subCurrentQr = this.store$
      .distinctUntilKeyChanged('currentQuery')
      .pluck('currentQuery')
      .subscribe(() => this.ResetChartData())
    // Get the Route Params
    this.subRoute = this.Route.params
      .distinctUntilChanged((before, after) => compare(before, after))
      .switchMap(params =>
        this.profiles$.map(
          (
            profiles // Retrieve The Current Branch from the UserProfile List
          ) => (profiles ? profiles.find(prof => prof.OldProfileId === +params['id']) : undefined)
        )
      )
      .filter(info => info && !compare(info, this.activeBranch.info)) // Security Measures Prevents Infinite Loop
      .do(
        info =>
          (this.branchColor =
            +info.OldProfileId.toString().split('')[0] + +info.OldProfileId.toString().split('')[1])
      )
      .do(info => this.store.dispatch(new SaveInfo(info))) // We save this info and then...
      .distinctUntilChanged((before, after) => compare(before, after))
      .switchMap(val => this.Route.queryParams) // ... We switch to our queryParams to
      .filter(() => Boolean(this.activeBranch.info.OldProfileId))
      .subscribe(info => this.ApplyQueryParams(info)) // Finally we apply the query

    /*     this.store$.distinctUntilKeyChanged('closeAnswers').subscribe(store => {
      const { closeQuestions, closeAnswers } = store
      const flatAnswers = flatten<CloseAnswer>(closeAnswers)
      const mappedQuestions = closeQuestions
        .map(({ idPregunta: value, pregunta: text }) => ({ value, text }))
        .map(q => {
          const myAnswer = flatAnswers.filter(a => a.Pregunta === q.text)
          if (myAnswer) {
            const children = myAnswer.map(({ Respuesta: value, Respuesta: text }) => ({
              value,
              text
            }))
            return updateObject(q, { children })
          }
          return undefined
        })
        .filter(q => !!q.children.length)

      this.questionsList = reduce(uniqueValue, [], [...this.questionsList, ...mappedQuestions])
    }) */
  }

  // Private Helpers

  private ResetView() {
    this.ResetResume()
    this.store.dispatch(new ResetAll())
    this.ResetChartData()
  }

  private ResetButInfo() {
    this.ResetResume()
    this.store.dispatch(new ResetButInfo())
    this.ResetChartData()
  }

  private ResetChartData() {
    this.chartData = new BranchChartData(new ChartData([], [], []), [], [])
  }

  private ResetResume() {
    this.totalToday = new BehaviorSubject(0)
    this.totalGeneral = new BehaviorSubject(0)
    this.newContacts = new BehaviorSubject(0)
    this.branchIndex = new BehaviorSubject(0)
  }

  private SaveHistoricEntries(entries: any[]) {
    this.chartData = updateObject(this.chartData, {
      historic: {
        colors: [gamaRegresando()[this.branchColor]],
        data: entries[1].sort((prev, curr) => prev.label > curr.label),
        labels: entries[0]
      }
    })
  }

  private SaveCloseAnswers(entries: ChartData[]) {
    this.chartData = updateObject(this.chartData, {
      ACLOSE: [...this.chartData.ACLOSE, entries[0]]
    })
  }

  private SaveOpenAnswers(entries: OpenAnswerData[]) {
    this.chartData = updateObject(this.chartData, {
      AOPEN: [...this.chartData.AOPEN, entries[0]]
    })
  }
}
