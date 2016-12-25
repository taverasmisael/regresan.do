import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { StartRequest, SaveInfo} from '../../../../actions/sucursal.actions';
import { ActionTypes } from '../../../../actions/auth.actions';

import { UserProfile } from '../../../../models/userprofile';
import { AppState } from '../../../../models/appstate';
import { SucursalState } from '../../../../models/sucursalstate';

@Component({
  selector: 'sucursales-details',
  templateUrl: './sucursales-details.component.html',
  styleUrls: ['./sucursales-details.component.scss']
})
export class SucursalesDetailsComponent implements OnInit, OnDestroy {
  id: number;
  private sub$: Subscription;
  private profileSub$: Subscription;
  private currentProfile: UserProfile;
  private SucursalState: SucursalState;

  constructor(private route: ActivatedRoute, private store: Store<AppState>) { }

  ngOnInit() {
    this.store.select<AppState>('MainStore')
      .distinctUntilKeyChanged('currentSucursal')
      .pluck<SucursalState>('currentSucursal')
      .subscribe(store => this.SucursalState = store);

    this.sub$ = this.route.params.distinctUntilChanged()
      .subscribe(params => {
      this.id = +params['id'];
      this.profileSub$ = this.store.select<AppState>('MainStore')
        .pluck<UserProfile[]>('auth', 'currentUser', 'Profiles')
        .subscribe(profiles => {
          let profile = profiles.find(prof => prof.OldProfileId === this.id);
          this.store.dispatch(new SaveInfo(profile));
        });
    });
  }

  ngOnDestroy() {
    this.sub$.unsubscribe();
    this.profileSub$.unsubscribe();
  }
}
