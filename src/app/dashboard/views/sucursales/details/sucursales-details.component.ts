import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

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
export class SucursalesDetailsComponent implements OnInit {
  id: number;
  private sub: any;
  private currentProfile: UserProfile;
  private SucursalStore: SucursalState;

  constructor(private route: ActivatedRoute, private store: Store<AppState>) { }

  ngOnInit() {
    this.store.select<AppState>('MainStore')
      .distinctUntilKeyChanged('currentSucursal')
      .pluck<SucursalState>('currentSucursal')
      .subscribe(store => this.SucursalStore = store);

    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.store.select<AppState>('MainStore')
        .map(({auth}) =>
          auth.currentUser.Profiles.filter(profiles => +profiles.$id === this.id)[0]
        ).subscribe(profile => this.store.dispatch(new SaveInfo(profile)));
    });
  }

}
