import { Component, OnInit, HostBinding } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { RespuestasService } from '../../../../services/respuestas.service';

import { StartRequest, SaveInfo } from '../../../../actions/sucursal.actions';
import { ActionTypes } from '../../../../actions/auth.actions';

import { UserProfile } from '../../../../models/userprofile';
import { AppState } from '../../../../models/appstate';
import { SucursalState } from '../../../../models/sucursalstate';

@Component({
  selector: 'sucursales-details',
  templateUrl: './sucursales-details.component.html',
  styleUrls: ['./sucursales-details.component.scss'],
})
export class SucursalesDetailsComponent implements OnInit {
  id$: Observable<number>;
  private SucursalState: SucursalState;

  @HostBinding('class.mdl-color--primary') true;
  constructor(private route: ActivatedRoute,
    private store: Store<AppState>,
    private respuestas: RespuestasService) { }

  ngOnInit() {
    this.store.select<AppState>('MainStore')
      .distinctUntilKeyChanged('currentSucursal')
      .pluck<SucursalState>('currentSucursal')
      .subscribe(store => this.SucursalState = store);

    this.id$ = this.route.params
      .distinctUntilChanged()
      .pluck<number>('id');

    Observable.zip(
      this.id$,
      this.store.select<AppState>('MainStore')
        .pluck<UserProfile[]>('auth', 'currentUser', 'Profiles')
    ).flatMap(zip => {
      let profile = zip[1].find(prof => prof.OldProfileId === +zip[0]);
      return Observable.of(profile);
    })
    .subscribe(profile => {
      this.store.dispatch(new SaveInfo(profile));
    });
  }
}
