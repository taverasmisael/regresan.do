import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import * as moment from 'moment';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { PreguntasService } from '@services/preguntas.service';
import { RespuestasService } from '@services/respuestas.service';
import { KpisService } from '@services/kpis.service';

import { makePieChart, TotalPorDiaLineal } from '@utilities/respuestas';
import { updateObject } from '@utilities/objects';
import { merge } from '@utilities/arrays';
import { ratingPalette, gamaRegresando } from '@utilities/colors';

import { AppState } from '@models/states/appstate';
import { SucursalState } from '@models/states/sucursalstate';
import { Pregunta } from '@models/pregunta';
import { APIRequestUser, APIRequestRespuesta } from '@models/apiparams';
import { UserProfile } from '@models/userprofile';

@Component({
  selector: 'app-sucursales-details',
  templateUrl: './sucursales-details.component.html',
  styleUrls: ['./sucursales-details.component.scss'],
})
export class SucursalesDetailsComponent implements OnInit, AfterViewInit, OnDestroy {

  public ActiveBranch: SucursalState;

  constructor(private Preguntas: PreguntasService,
    private Respuestas: RespuestasService, KPIS: KpisService,
    private Store: Store<AppState>, private Route: ActivatedRoute) { }

    ngOnInit() {
      // This update the ActiveBranch on each StoreAction
      this.Store.select('MainStore')
        .distinctUntilKeyChanged('currentSucursal')
        .pluck<SucursalState>('currentSucursal').subscribe((branch) => {
          this.ActiveBranch = branch;
        });

      const profiles$ = this.Store.select('MainStore')
        .pluck<UserProfile[]>('auth', 'currentUser', 'Profiles');

      // Get the Route Params
      this.Route.params.switchMap(
        (params: Params) =>
           profiles$.map(profiles => // Retrieve The Current Branch from the UserProfile List
            profiles.find(prof => prof.OldProfileId === +params['id']))
      ).subscribe(
        (res) =>  console.log(res),
        (error) => console.log(error)
      );

      // Get the Route query
      this.Route.queryParams.subscribe(
        (res) =>  console.log(res),
        (err) => console.error(err),
        () => console.log('Done!')
      );
    }

    ngAfterViewInit() {
      console.log('AfterViewInit...');
    }

    ngOnDestroy() {
      console.log('Destroying...');
    }
}


interface LoadAnswerParams {
  preguntas: Pregunta[], query: APIRequestUser
};
