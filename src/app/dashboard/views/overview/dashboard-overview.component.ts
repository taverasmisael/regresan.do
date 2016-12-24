import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { AppState } from '../../../models/appstate';
import { AuthState } from '../../../models/authstate';

import * as moment from 'moment';
import { RespuestasService} from '../../../services/respuestas.service';
import { makeDonughtChart} from '../../../utilities/respuestas';


@Component({
  selector: 'dashboard-overview',
  templateUrl: './dashboard-overview.component.html',
  styleUrls: ['./dashboard-overview.component.scss']
})
export class DashboardOverviewComponent implements OnInit {

  private AuthState: Observable<AuthState>;
  private today = moment();
  private aWeekAgo = this.today.subtract(7, 'days');
  private graphColors: string[] = ["#8BC34A", "#0D47A1", "#009688", "#F44336", "#FFEB3B", "#03A9F4"]
  constructor(private respuestas: RespuestasService, private store: Store<AppState>) {
      this.AuthState = this.store.select<AppState>('MainStore').map(({auth}) => auth);
  }

  ngOnInit() {
    this.respuestas.getAll(this.aWeekAgo.unix(), this.today.unix())
      .map(res => res['Preguntas'].reduce(makeDonughtChart, []))
      .subscribe(data => {
        Morris.Donut({
          element: 'chartSucursales',
          data,
          colors: this.graphColors.sort(() => 0.5 - Math.random())
        })
      })
  }

}
