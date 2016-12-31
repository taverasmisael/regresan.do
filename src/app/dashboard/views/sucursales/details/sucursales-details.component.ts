import { Component, OnInit, HostBinding, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import * as moment from 'moment';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { PreguntasService } from '../../../../services/preguntas.service';
import { RespuestasService } from '../../../../services/respuestas.service';

import { makePieChart } from '../../../../utilities/respuestas';

import { StopRequest, StartRequest, SaveInfo,
  SaveLoadedQuestions, SaveLoadedAnswers, ResetStore} from '../../../../actions/sucursal.actions';
import { ActionTypes } from '../../../../actions/auth.actions';

import { UserProfile } from '../../../../models/userprofile';
import { AppState } from '../../../../models/appstate';
import { SucursalState } from '../../../../models/sucursalstate';
import { Pregunta } from '../../../../models/Pregunta';

@Component({
  selector: 'sucursales-details',
  templateUrl: './sucursales-details.component.html',
  styleUrls: ['./sucursales-details.component.scss'],
})
export class SucursalesDetailsComponent implements OnInit, AfterViewInit, OnDestroy {
  private id$: Observable<number>;
  public SucursalState: SucursalState;
  private CurrentProfile: UserProfile;

  private chartColors = ['#8BC34A', '#0D47A1', '#009688', '#F44336', '#FFEB3B', '#03A9F4']

  private today = moment();
  private aWeekAgo = this.today.subtract(7, 'days');


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
      .distinctUntilKeyChanged('currentSucursal')
      .pluck<SucursalState>('currentSucursal')
      .subscribe(store => this.SucursalState = store);

    this.id$ = this.route.params
      .distinctUntilChanged()
      .pluck<number>('id');

    this.SaveCurrentSucursal();
    this.LoadQuestions().subscribe(this.loadAnswers.bind(this), this.handleErrors.bind(this));
  }

  ngOnDestroy() {
    this.store.dispatch(new ResetStore());
  }

  private LoadQuestions() {
    this.store.dispatch(new StartRequest('Cargando Preguntas...'));
    let profileId = this.CurrentProfile.OldProfileId;
    let query = {
      profile: profileId.toString(),
      start: this.aWeekAgo.unix().toString(),
      end: this.today.unix().toString()
    };
    return this.preguntas
      .getAllByProfile(query)
      .map<Pregunta[]>(res => res['Respuestas'])
  }

  private loadAnswers(qs: Pregunta[]) {
    if (qs && qs.length) {
      const closedQs = qs.filter(q => q.tipoPregunta !== 'Abierta')
      const qsIds = closedQs // Queremos las preguntas que NO son abiertas
        .map(q => q.idPregunta);

      this.store.dispatch(new StopRequest({}));
      this.store.dispatch(new SaveLoadedQuestions(closedQs));
      this.store.dispatch(new StartRequest('Cargando Respuestas...'));

      const answers$ = qsIds.reduce((prev, curr) => {
        let query = {
          pregunta: curr.toString(),
          profile: this.CurrentProfile.OldProfileId.toString(),
          start: this.aWeekAgo.unix().toString(),
          end: this.today.unix().toString()
        }
        return [...prev, this.respuestas.getFromProfile(query)
          .map(val => ({respuestas: val['Respuestas'], pregunta: curr.toString()}))
        ];
      }, []);

      Observable.forkJoin(answers$)
        .subscribe(((answers: Pregunta[][]) => {
          this.store.dispatch(new StopRequest({}));
          this.store.dispatch(new SaveLoadedAnswers(answers));
          answers.forEach((resp: Pregunta[]) => {
            let data = resp['respuestas'].reduce(makePieChart, []);
            let currentQ = resp['pregunta'];
            let element = `chart-${currentQ}`;
          })
        }));
    }

  }


  private handleErrors(err) {
    return err.status === 401 && this.store.dispatch({ type: ActionTypes.LOGOUT_START });
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
