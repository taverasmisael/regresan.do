import {
  Component,
  OnInit,
  ViewChild,
  Input,
  ElementRef,
  SimpleChanges,
  OnChanges
} from '@angular/core';

import compare from 'just-compare';

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
export class IndiceCamarerosComponent implements OnInit, OnChanges {
  private colors: string[];
  private COLORS: string[];
  private needsToRequest: Boolean;

  @Input() filter: APIRequestUser;
  @ViewChild('indiceCamarerosDialog') indiceCamarerosDialog: ElementRef;

  public loading: Boolean;
  public errorText: string;
  public chartData: { labels: any[], data: any[] };
  public chartOptions: any;
  public chartColor: ChartJsColor[];

  constructor(private service: StaffService) { }

  ngOnInit() {
    if (!this.indiceCamarerosDialog.nativeElement.showModal) {
      dialogPolyfill.registerDialog(this.indiceCamarerosDialog.nativeElement);
    }
    this.chartOptions = {};
    this.colors = gamaRegresando().reverse();
    this.COLORS = [...this.colors].sort(() => 0.5 - Math.random());
    this.chartColor = createPalette(this.COLORS, 0);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['filter'] && !compare(changes['filter'].currentValue, changes['filter'].previousValue)) {
      this.needsToRequest = true;
    }
  }

  showDialog() {
    this.indiceCamarerosDialog.nativeElement.showModal();
    if (this.needsToRequest) {
      this.loading = true;
      this.service.getKpisCamareros(this.filter)
        .map(res => createLinearCamareroKpi(res['Camareros']))
        .subscribe(
          (res) => {
            this.loading = false;
            this.chartData = res;
          },
          (error) => this.handleErrors(error),
          () => this.needsToRequest = false
        );
    }
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
