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
  SaveLoadedQuestions, SaveLoadedAnswers, ResetStore
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
  private today = moment();
  private aWeekAgo = moment().subtract(7, 'days');
  private QuestionsQuery: APIRequestUser;

  public SucursalState: SucursalState;
  public CurrentProfile: UserProfile;

  public userProfiles: UserProfile[];
  public answers: any[];

  public COLORS = rating(true);
  public chartError: string;



  @HostBinding('class.mdl-color--primary') true;
  constructor(private route: ActivatedRoute,
    private store: Store<AppState>,
    private preguntas: PreguntasService,
    private respuestas: RespuestasService) { }

  ngAfterViewInit() {
    componentHandler.upgradeAllRegistered();
  }

  ngOnInit() {
    this.store.select<AppState>('MainStore')
      .pluck('auth')
      .pluck<UserProfile[]>('currentUser', 'Profiles')
      .subscribe(profiles => this.userProfiles = profiles);

    this.store.select<AppState>('MainStore')
      .distinctUntilKeyChanged('currentSucursal')
      .pluck<SucursalState>('currentSucursal')
      .subscribe(store => this.SucursalState = store);

    this.id$ = this.route.params
      .distinctUntilChanged()
      .pluck<number>('id');

    this.SaveCurrentSucursal();
    this.QuestionsQuery = {
      profile: this.CurrentProfile.OldProfileId.toString(),
      start: this.aWeekAgo.unix().toString(),
      end: this.today.unix().toString()
    }
    this.loadAllCharts(this.QuestionsQuery);
  }

  public applyFilters(filter: Filter) {
    this.QuestionsQuery = updateObject(this.QuestionsQuery, {
      start: moment(filter.fechaInicio, 'DD/MM/YYYY').unix().toString(),
      end: moment(filter.fechaFin, 'DD/MM/YYYY').hours(18).unix().toString()
    });
    this.loadAllCharts(this.QuestionsQuery);
  }

  ngOnDestroy() {
    this.store.dispatch(new ResetStore());
  }

  private loadAllCharts(query: APIRequestUser) {
    this.store.dispatch(new ResetStore());
    this.LoadQuestions(query)
      .subscribe(
        this.loadAnswers.bind(this),
        this.handleErrors.bind(this)
      );
  }

  private LoadQuestions(query: APIRequestUser) {
    this.store.dispatch(new StartRequest('Cargando Preguntas...'));
    return this.preguntas
      .getAllByProfile(query)
      .map<LoadAnswerParams>(res => ({preguntas: res['Respuestas'], query}))
  }

  private loadAnswers({preguntas: qs, query}: LoadAnswerParams) {
    if (qs && qs.length) {
      const closedQs = qs.filter(q => q.tipoPregunta !== 'Abierta')
      const qsIds = closedQs // Queremos las preguntas que NO son abiertas
        .map(q => q.idPregunta);

      this.store.dispatch(new StopRequest({}));
      this.store.dispatch(new SaveLoadedQuestions(closedQs));
      this.store.dispatch(new StartRequest('Cargando Respuestas...'));

      const answers$ = qsIds.reduce((prev, curr) => {
        let currentQuery = updateObject(query, { pregunta: curr.toString() });
        return [...prev, this.respuestas.getFromProfile(currentQuery)
          .map(val => ({ respuestas: val['RespuestasPreguntas'], pregunta: curr.toString() }))
        ];
      }, []);

      Observable.forkJoin(answers$)
        .subscribe((answers: Pregunta[][]) => {
          this.store.dispatch(new SaveLoadedAnswers(answers));
          this.answers = answers.reduce((prev, curr) => {
            return [...prev, curr['respuestas'].reduce(makePieChart, [[], []])];
          }, []);
          this.store.dispatch(new StopRequest({}));
        });

    }
  }


  private handleErrors(err) {
    if (err.status === 401) {
      this.store.dispatch({ type: ActionTypes.LOGOUT_START });
    } else {
      this.store.dispatch(new StopRequest({}));
      this.chartError = 'Error obteniendo la informaacion del Servidor';
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
}


interface LoadAnswerParams {
  preguntas: Pregunta[], query: APIRequestUser
};
