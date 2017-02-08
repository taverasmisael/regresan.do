import {
  Component,
  OnInit,
  ViewChild,
  Input,
  ElementRef
} from '@angular/core';

import { StaffService } from '../services/staff.service';

import { APIRequestUser } from '../models/apiparams';

import { createLinearCamareroKpi } from '../utilities/kpis';
import { createPalette, ChartJsColor } from '../utilities/charts';
import { gamaRegresando } from '../utilities/colors';

@Component({
  selector: 'app-indice-camareros',
  templateUrl: './indice-camareros.component.html',
  styleUrls: ['./indice-camareros.component.scss']
})
export class IndiceCamarerosComponent implements OnInit {
  private colors: string[];
  private COLORS: string[];

  @Input() filter: APIRequestUser;
  @ViewChild('indiceCamarerosDialog') indiceCamarerosDialog: ElementRef;

  public loading: Boolean;
  public errorText: string;
  public chartData: {labels: any[], data: any[]};
  public chartOptions: any;
  public chartColor: ChartJsColor[];

  constructor(private service: StaffService) { }

  ngOnInit() {
    if (!this.indiceCamarerosDialog.nativeElement.showModal) {
      dialogPolyfill.registerDialog(this.indiceCamarerosDialog.nativeElement);
    }
    this.chartOptions = { scales: { yAxes: [{ ticks: { beginAtZero: true } }] } };
    this.colors = gamaRegresando().reverse();
    this.COLORS = [...this.colors].sort(() => 0.5 - Math.random());
    this.chartColor = createPalette(this.COLORS, 0);
  }

  showDialog() {
    this.loading = true;
    this.indiceCamarerosDialog.nativeElement.showModal();
    this.service.getKpisCamareros(this.filter)
      .map(res => createLinearCamareroKpi(res['Camareros']))
      .subscribe(
        (res) => {
          this.loading = false;
          this.chartData = res;
        } ,
        (error) => this.handleErrors(error)
      );
  }

  private handleErrors(err) {
    if (err.status === 401) {
      console.error('Unauthorized');
    } else {
      this.errorText = 'Error obteniendo la informacion del Servidor';
    }
  }

  closeDialog(clean?: boolean) {
    this.indiceCamarerosDialog.nativeElement.close();
  }

}
