import { Component, OnInit, HostBinding, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import * as moment from 'moment';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { PreguntasService } from '../../../../services/preguntas.service';
import { RespuestasService } from '../../../../services/respuestas.service';

import { makePieChart, TotalPorDiaLineal } from '../../../../utilities/respuestas';
import { updateObject } from '../../../../utilities/objects';
import { merge } from '../../../../utilities/arrays';
import { ratingPalette, gamaRegresando } from '../../../../utilities/colors';

import {
  StopRequest, StartRequest, SaveInfo,
  SaveOpenQuestions, SaveOpenAnswers,
  SaveCloseQuestions, SaveCloseAnswer, SaveAnswerChart,
  ResetSucursal, ResetQA, UpdateAnswerChart, SaveHistoric, SaveStaffRanking
} from '../../../../actions/sucursal.actions';
import { ActionTypes } from '../../../../actions/auth.actions';
import { Filter } from '../../../../models/filter';

import { UserProfile } from '../../../../models/userprofile';
import { AppState } from '../../../../models/states/appstate';
import { SucursalState } from '../../../../models/states/sucursalstate';
import { Pregunta } from '../../../../models/Pregunta';
import { APIRequestParams, APIRequestRespuesta, APIRequestUser } from '../../../../models/apiparams';
import { RespuestaAbierta } from '../../../../models/respuesta-abierta';

@Component({
  selector: 'app-sucursales-details',
  templateUrl: './sucursales-details.component.html',
  styleUrls: ['./sucursales-details.component.scss'],
})
export class SucursalesDetailsComponent implements OnInit, AfterViewInit, OnDestroy {
  public currentFilters: Filter;
  public SucursalState: SucursalState;
  public CurrentProfile: UserProfile;

  public openAnswers: any[];

  public chartErrors: string[];
  public questionError: string;
  public openAnswersError: string;

  public totalGeneral: Observable<number>;
  public totalHoy: Observable<number>;
  public nuevosContactos: Observable<number>;
  public indiceSucursal: Observable<number>;
  public profiles$: Observable<UserProfile[]>;

  private id$: Observable<number>;
  private CurrentSucursal: Observable<SucursalState>;
  private today: moment.Moment;
  private aWeekAgo: moment.Moment;
  private QuestionsQuery: APIRequestUser;
  private closeAnswers$: Array<Observable<any>>;
  private rattingColors: any;
  private rattingColorsArray: string[];

  constructor(private route: ActivatedRoute,
    private store: Store<AppState>,
    private preguntas: PreguntasService,
    private respuestas: RespuestasService) { }

  ngOnInit() {
    this.today = moment();
    this.aWeekAgo = moment().subtract(7, 'days');
    this.store.dispatch(new SaveHistoric({ colors: [gamaRegresando()[3]] }));
    this.rattingColorsArray = ratingPalette(false);
    this.rattingColors = ratingPalette(true);
    this.currentFilters = {
      fechaInicio: this.aWeekAgo.format('DD/MM/YYYY'),
      fechaFin: this.today.format('DD/MM/YYYY')
    };
    this.id$ = this.route.params
      .distinctUntilKeyChanged('id')
      .pluck<number>('id');
    this.SaveCurrentSucursal();

    this.CurrentSucursal = this.store.select<AppState>('MainStore')
      .distinctUntilKeyChanged('currentSucursal')
      .pluck<SucursalState>('currentSucursal');
    this.CurrentSucursal.subscribe(store => this.SucursalState = store);
    this.CurrentSucursal
      .distinctUntilKeyChanged('info')
      .pluck<UserProfile>('info')
      .subscribe(userProfile => {
        this.CurrentProfile = userProfile;
        setTimeout(() => this.ngAfterViewInit(), 250)
      });
  }

  ngAfterViewInit() {
    componentHandler.upgradeAllRegistered();
    this.QuestionsQuery = {
      profile: this.CurrentProfile.OldProfileId.toString(),
      start: this.aWeekAgo.unix().toString(),
      end: this.today.unix().toString()
    }
    this.CurrentSucursal
      .distinctUntilKeyChanged('loading')
      .pluck<Boolean>('loading')
      .subscribe(isLoading => {
        if (isLoading) {
          setTimeout(() => componentHandler.upgradeAllRegistered(), 200);
        }
      });

    this.loadAllComponents(this.QuestionsQuery);
  }

  ngOnDestroy() {
    console.log('Destruyendo...');
    this.store.dispatch(new ResetSucursal());
  }

  applyFilters(filter: Filter) {
    this.QuestionsQuery = updateObject(this.QuestionsQuery, {
      start: moment(filter.fechaInicio, 'DD/MM/YYYY').unix().toString(),
      end: moment(filter.fechaFin, 'DD/MM/YYYY').hours(18).unix().toString()
    });
    this.loadAllComponents(this.QuestionsQuery);
  }

  loadHistoricoEncuestas(query: APIRequestParams) {
    this.store.dispatch(new SaveHistoric({
      loading: true,
      errorText: ''
    }));

    this.preguntas.getTotalPorDia(query)
      .map(res =>
        res['Encuestas']['TotalesxSucursalxDia']
          .sort((prev, curr) => moment(prev.Fecha).isSameOrAfter(moment(curr.Fecha)) ? 1 : -1)
      )
      .map(historial => TotalPorDiaLineal(historial, this.CurrentProfile.Title))
      .subscribe(
      data => {
        if (data[1].length) {
          const historic = {
            labels: data[0],
            data: data[1].sort((prev, curr) => prev.label > curr.label),
            loading: false
          };
          this.store.dispatch(new SaveHistoric(historic));
        } else {
          this.store.dispatch(new SaveHistoric({
            errorText: 'No se ha encontrado información con esos requisitos. Cambie el filtro e intente de nuevo',
            data: [],
            labels: [],
            loding: false
          }))
        }
      },
      error => {
        this.store.dispatch(new SaveHistoric({ loading: false }))
        if (error.status === 401) {
          this.store.dispatch({ type: ActionTypes.LOGOUT_START });
        } else {
          this.store.dispatch(new SaveHistoric({ errorText: 'Error Cargando Historico de Encuestas' }));
        }
      }
      );
  }

  loadResumen(query: APIRequestUser) {
    this.preguntas.getResumenSucursal(query)
      .map(res => res['Cabecera'])
      .subscribe(res => {
        if (res) {
          this.totalHoy = Observable.of(res['TotalEncuestadosHoy']);
          this.totalGeneral = Observable.of(res['TotalEncuestas']);
          this.nuevosContactos = Observable.of(res['NuevosContactos']);
          this.indiceSucursal = Observable.of(res['IndiceSucursal']);
        } else {
           this.totalHoy = Observable.of(0);
          this.totalGeneral = Observable.of(0);
          this.nuevosContactos = Observable.of(0);
          this.indiceSucursal = Observable.of(0);
        }

      });

  }

  giveMeMyColors(array: string[]) {
    let colors = array.map((el, i) => this.rattingColors[el] || this.rattingColorsArray[i]);
    return colors;
  }

   getMyAnswers(id: number) {
     return this.SucursalState.openAnswers.filter(answer => +answer.Pregunta === id);
   }

  loadCloseAnswer(index: number) {
    this.chartErrors[index] = '';
    this.store.dispatch(new StartRequest(`Cargando Respuesta #${index + 1}`));
    this.closeAnswers$[index].subscribe(
      val => {
        const req$val = val['respuestas'].reduce(makePieChart, [[], []]);
        const currentChart = [...req$val, this.giveMeMyColors(req$val[0])];
        this.store.dispatch(new UpdateAnswerChart({ id: val.pregunta, newChart: currentChart }));
      },
      err => this.handleAnswerError(err, index),
      () => this.store.dispatch(new StopRequest())
    )
  }

  loadOpenAnswers(qsIds: number[], query: APIRequestUser = this.QuestionsQuery) {
    const answers$ = qsIds.reduce((prev, curr) => {
      let currentQuery = updateObject(query, { pregunta: curr.toString() });
      return [...prev, this.respuestas.getAbiertasFromProfile(currentQuery)
        .map(val => ({ respuestas: val['RespuestasPreguntas'], pregunta: curr.toString() }))
      ];
    }, []);

    Observable.forkJoin(answers$)
      .subscribe((answers: any[]) => {
        this.openAnswersError = '';
        this.openAnswers = answers.reduce((prev, curr) => {
          return [...prev, curr.respuestas.map(a => ({
            respuesta: a.Respuesta,
            fecha: a.Fecha,
            sesion: a.Sesion,
            Pregunta: curr.pregunta,
            porcentaje: a.Porcentaje // UNUSED
          }))
          ]
        }, []);
        this.store.dispatch(new SaveOpenAnswers(this.openAnswers.reduce(merge)));
      },
      err => {
        if (err.status === 401) {
          this.store.dispatch({ type: ActionTypes.LOGOUT_START });
        } else {
          this.openAnswersError = 'Error obteniendo respuestas abiertas';
        }
      },
      () => this.store.dispatch(new StopRequest())
      );
  }

  loadRankingCamareros(query: APIRequestUser) {
    this.preguntas.getRankingCamareros(query)
      .map(res => res['RankingCamareros'].sort((prev, curr) => prev.Total > curr.Total))
      .subscribe(
      ranking => this.store.dispatch(new SaveStaffRanking(ranking)),
      error => this.handleErrors(error));
  }

  private loadAllComponents(query: APIRequestUser) {
    this.loadAllCharts(this.QuestionsQuery);
    this.loadResumen(this.QuestionsQuery);
    this.loadRankingCamareros(this.QuestionsQuery);
    this.loadHistoricoEncuestas(this.QuestionsQuery);
  }
  private loadAllCharts(query: APIRequestUser) {
    this.store.dispatch(new ResetQA());
    this.LoadQuestions(query)
      .subscribe(
      questions => this.loadAnswers(questions),
      err => this.handleErrors(err),
      () => this.store.dispatch(new StopRequest())
      );
  }

  private LoadQuestions(query: APIRequestUser) {
    this.store.dispatch(new StartRequest('Cargando Preguntas Cerradas...'));
    return this.preguntas
      .getAllByProfile(query)
      .map<LoadAnswerParams>(res => ({ preguntas: res['Respuestas'], query }))
  }

  private loadAnswers({preguntas: qs, query}: LoadAnswerParams) {
    this.store.dispatch(new StopRequest());
    const getIdPregunta = (q: Pregunta) => q.idPregunta;

    if (qs && qs.length) {
      this.store.dispatch(new StartRequest('Cargando Respuestas Cerradas...'));
      const openQs = qs.filter(q => q.tipoPregunta === 'Abierta');
      const closeQs = qs.filter(q => q.tipoPregunta !== 'Abierta');
      if (openQs.length) {
        this.store.dispatch(new SaveOpenQuestions(openQs));
        this.loadOpenAnswers(openQs.map(getIdPregunta), query);
      }
      this.store.dispatch(new SaveCloseQuestions(closeQs));
      this.loadCloseAnswers(closeQs.map(getIdPregunta), query);

    } else {
      this.store.dispatch(new StopRequest());
    }
  }

  private loadCloseAnswers(qsIds: number[], query: APIRequestUser) {
    this.closeAnswers$ = qsIds.reduce((prev, curr) => {
      this.store.dispatch(new SaveAnswerChart({ [curr.toString()]: [[], [], []] }));
      let currentQuery = updateObject(query, { pregunta: curr.toString() });
      return [...prev, this.respuestas.getFromProfile(currentQuery)
        .map(val => ({ respuestas: val['RespuestasPreguntas'], pregunta: curr.toString() }))
      ];
    }, []);

    this.chartErrors = new Array(this.closeAnswers$.length); // Prepare for errors
    this.closeAnswers$.forEach((req$, index) => this.loadCloseAnswer(index));
  }

  private handleAnswerError(err: any, index: number) {
    if (err.status === 401) {
      this.store.dispatch({ type: ActionTypes.LOGOUT_START });
    } else {
      this.chartErrors[index] = `Error cargando Respuesta #${index + 1}`;
    }
  }

  private handleErrors(err) {
    if (err.status === 401) {
      this.store.dispatch({ type: ActionTypes.LOGOUT_START });
    } else {
      this.store.dispatch(new StopRequest());
      this.questionError = 'Error obteniendo la informacion del Servidor';
    }
  }

  private SaveCurrentSucursal() {
    this.profiles$ = this.store.select<AppState>('MainStore')
          .distinctUntilKeyChanged('auth')
          .pluck<UserProfile[]>('auth', 'currentUser', 'Profiles')
    this.id$
      .switchMap(id =>
          this.profiles$
          .map(profile => profile.find(prof => prof.OldProfileId === +id))
      ).subscribe(profile => {
        this.store.dispatch(new SaveInfo(profile));
      });
  }
}


interface LoadAnswerParams {
  preguntas: Pregunta[], query: APIRequestUser
};
