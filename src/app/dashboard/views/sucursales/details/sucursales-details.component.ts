import { Component, OnInit, HostBinding, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import * as moment from 'moment';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { PreguntasService } from '../../../../services/preguntas.service';
import { RespuestasService } from '../../../../services/respuestas.service';

import { makePieChart } from '../../../../utilities/respuestas';
import { updateObject } from '../../../../utilities/objects';
import { rating } from '../../../../utilities/colors';

import {
  StopRequest, StartRequest, SaveInfo,
  SaveOpenQuestions, SaveOpenAnswers,
  SaveCloseQuestions, SaveCloseAnswers,
  ResetSucursal, ResetQA
} from '../../../../actions/sucursal.actions';
import { ActionTypes } from '../../../../actions/auth.actions';
import { Filter } from '../../../../models/toolbar-flters';

import { UserProfile } from '../../../../models/userprofile';
import { AppState } from '../../../../models/appstate';
import { SucursalState } from '../../../../models/sucursalstate';
import { Pregunta } from '../../../../models/Pregunta';
import { APIRequestRespuesta, APIRequestUser } from '../../../../models/apiparams';

@Component({
  selector: 'sucursales-details',
  templateUrl: './sucursales-details.component.html',
  styleUrls: ['./sucursales-details.component.scss'],
})
export class SucursalesDetailsComponent implements OnInit, AfterViewInit, OnDestroy {
  private id$: Observable<number>;
  private CurrentSucursal: Observable<SucursalState>;
  private today = moment();
  private aWeekAgo = moment().subtract(7, 'days');
  private QuestionsQuery: APIRequestUser;

  public SucursalState: SucursalState;
  public CurrentProfile: UserProfile;

  public closeAnswers: any[];
  public openAnswers: any[];

  public COLORS = rating(true);
  public chartError: string;



  @HostBinding('class.mdl-color--primary') true;
  constructor(private route: ActivatedRoute,
    private store: Store<AppState>,
    private preguntas: PreguntasService,
    private respuestas: RespuestasService) { }

  ngOnInit() {
    this.id$ = this.route.params
      .distinctUntilChanged()
      .pluck<number>('id');
    this.SaveCurrentSucursal();

    this.CurrentSucursal = this.store.select<AppState>('MainStore')
      .distinctUntilKeyChanged('currentSucursal')
      .pluck<SucursalState>('currentSucursal');
    this.CurrentSucursal.subscribe(store => this.SucursalState = store);

    this.CurrentSucursal
      .distinctUntilKeyChanged('closeAnswers')
      .pluck<any[]>('closeAnswers')
      .subscribe(answers => this.closeAnswers = this.transformAnswerToChart(answers));

    this.QuestionsQuery = {
      profile: this.CurrentProfile.OldProfileId.toString(),
      start: this.aWeekAgo.unix().toString(),
      end: this.today.unix().toString()
    }
    this.loadAllCharts(this.QuestionsQuery);

    this.CurrentSucursal
      .distinctUntilKeyChanged('loading')
      .subscribe(() => {
        setTimeout(() => componentHandler.upgradeAllRegistered(), 100);
      })
  }
  ngAfterViewInit() {
    componentHandler.upgradeAllRegistered();
  }

  ngOnDestroy() {
    this.store.dispatch(new ResetSucursal());
  }


  public applyFilters(filter: Filter) {
    this.QuestionsQuery = updateObject(this.QuestionsQuery, {
      start: moment(filter.fechaInicio, 'DD/MM/YYYY').unix().toString(),
      end: moment(filter.fechaFin, 'DD/MM/YYYY').hours(18).unix().toString()
    });
    this.loadAllCharts(this.QuestionsQuery);
  }

  private loadAllCharts(query: APIRequestUser) {
    this.store.dispatch(new ResetQA());
    this.LoadQuestions(query)
      .subscribe(
      this.loadAnswers.bind(this),
      this.handleErrors.bind(this)
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
      const openedQs = qs.filter(q => q.tipoPregunta === 'Abierta');
      const closedQs = qs.filter(q => q.tipoPregunta !== 'Abierta');
      if (openedQs.length) {
        this.store.dispatch(new SaveOpenQuestions(openedQs));
        this.loadOpenAnswers(openedQs.map(getIdPregunta), query);
      }
      this.store.dispatch(new SaveCloseQuestions(closedQs));
      this.loadClosedAnswers(closedQs.map(getIdPregunta), query);

    } else {
      this.store.dispatch(new StopRequest());
    }
  }



  private loadOpenAnswers(qsIds: number[], query: APIRequestUser) {
    const answers$ = qsIds.reduce((prev, curr) => {
      let currentQuery = updateObject(query, { pregunta: curr.toString() });
      return [...prev, this.respuestas.getAbiertasFromProfile(currentQuery)
        .map(val => ({ respuestas: val['RespuestasPreguntas'], pregunta: curr.toString() }))
      ];
    }, []);

    Observable.forkJoin(answers$)
      .subscribe((answers: any[]) => {
        this.openAnswers = answers.reduce((prev, curr) => {
          return [...prev, curr.respuestas.map(a => ({
            respuesta: a.Respuesta,
            fecha: a.Fecha,
            sesion: a.sesion,
            pregunta: curr.pregunta,
            porcentaje: a.Porcentaje // UNUSED
          }))
          ]
        }, []);
        console.log(this.openAnswers);
        this.store.dispatch(new SaveOpenAnswers(this.openAnswers));
        this.store.dispatch(new StopRequest());
      });
  }

  private loadClosedAnswers(qsIds: number[], query: APIRequestUser) {
    const answers$ = qsIds.reduce((prev, curr) => {
      let currentQuery = updateObject(query, { pregunta: curr.toString() });
      return [...prev, this.respuestas.getFromProfile(currentQuery)
        .map(val => ({ respuestas: val['RespuestasPreguntas'], pregunta: curr.toString() }))
      ];
    }, []);

    Observable.forkJoin(answers$)
      .subscribe((answers: Pregunta[][]) => {
        this.store.dispatch(new SaveCloseAnswers(answers));
        this.store.dispatch(new StopRequest());
      });
  }

  private handleErrors(err) {
    if (err.status === 401) {
      this.store.dispatch({ type: ActionTypes.LOGOUT_START });
    } else {
      this.store.dispatch(new StopRequest());
      this.chartError = 'Error obteniendo la informacion del Servidor';
    }
  }

  private SaveCurrentSucursal() {
    Observable.zip(
      this.id$,
      this.store.select<AppState>('MainStore')
        .pluck<UserProfile[]>('auth', 'currentUser', 'Profiles')
    ).flatMap(zip => {
      let profile = zip[1].find(prof => prof.OldProfileId === +zip[0]);
      return Observable.of(profile);
    })
      .subscribe(profile => {
        this.CurrentProfile = profile;
        this.store.dispatch(new SaveInfo(profile));
      });
  }

  private transformAnswerToChart(answers: any[]) {
    return answers.reduce((prev, curr) => {
      return [...prev, curr['respuestas'].reduce(makePieChart, [[], []])];
    }, []);
  }
}


interface LoadAnswerParams {
  preguntas: Pregunta[], query: APIRequestUser
};
