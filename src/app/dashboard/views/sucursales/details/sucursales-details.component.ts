import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { UserProfile } from '../../../../models/userprofile';
import { AppState } from '../../../../models/appstate';
import { AuthState } from '../../../../models/authstate';

@Component({
  selector: 'sucursales-details',
  templateUrl: './sucursales-details.component.html',
  styleUrls: ['./sucursales-details.component.scss']
})
export class SucursalesDetailsComponent implements OnInit {
  id: number;
  private sub: any;
  private currentProfile: UserProfile;

  constructor(private route: ActivatedRoute, private store: Store<AppState>) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.store.select<AppState>('MainStore')
        .map(({auth}) => auth.currentUser.Profiles.filter(profiles => +profiles.$id === this.id)[0])
        .subscribe(profile => this.currentProfile = profile);
    });
  }

}
