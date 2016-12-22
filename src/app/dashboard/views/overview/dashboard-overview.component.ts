import { Component, OnInit } from '@angular/core';

import * as moment from 'moment';
import { RespuestasService} from '../../../services/respuestas.service';
import { makeDonughtChart} from '../../../utilities/respuestas';


@Component({
  selector: 'dashboard-overview',
  templateUrl: './dashboard-overview.component.html',
  styleUrls: ['./dashboard-overview.component.scss']
})
export class DashboardOverviewComponent implements OnInit {

  private today = moment();
  private aWeekAgo = this.today.subtract(7, 'days');
  private graphColors: string[] = ["#8BC34A", "#0D47A1", "#009688", "#F44336", "#FFEB3B", "#03A9F4"]
  constructor(private respuestas: RespuestasService) { }

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
