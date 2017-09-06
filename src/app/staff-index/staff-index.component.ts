import {
  Component,
  OnInit,
  ViewChild,
  Input,
  ElementRef,
  SimpleChanges,
  OnChanges
} from '@angular/core'

import compare from 'just-compare'

import { StaffService } from '@services/staff.service'

import { StandardRequest } from '@models/standardRequest'

import { createLinearStaffKpi } from '@utilities/kpis'
import { createPalette, ChartJsColor } from '@utilities/charts'
import { gamaRegresando } from '@utilities/colors'

@Component({
  selector: 'app-staff-index',
  templateUrl: './staff-index.component.html',
  styleUrls: ['./staff-index.component.scss']
})
export class StaffIndexComponent implements OnInit, OnChanges {
  private COLORS: string[]
  private needsToRequest: Boolean

  @Input() filter: StandardRequest
  @ViewChild('staffIndexDialog') staffIndexDialog: ElementRef

  public loading: Boolean
  public errorText: string
  public chartData: { labels: any[]; data: any[] }
  public chartOptions: any
  public chartColor: ChartJsColor[]

  constructor(private service: StaffService) {}

  ngOnInit() {
    if (!this.staffIndexDialog.nativeElement.showModal) {
      dialogPolyfill.registerDialog(this.staffIndexDialog.nativeElement)
    }
    this.chartOptions = {}
    this.COLORS = gamaRegresando().reverse()
    this.chartColor = createPalette(this.COLORS, 0)
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['filter'] &&
      !compare(changes['filter'].currentValue, changes['filter'].previousValue)
    ) {
      this.needsToRequest = true
    }
  }

  showDialog() {
    this.staffIndexDialog.nativeElement.showModal()
    if (this.needsToRequest) {
      this.loading = true
      this.service
        .getKpisCamareros(this.filter)
        .map(res => createLinearStaffKpi(res['Camareros']))
        .subscribe(
          res => {
            this.loading = false
            this.chartData = res
          },
          error => this.handleErrors(error),
          () => (this.needsToRequest = false)
        )
    }
  }

  private handleErrors(err) {
    if (err.status === 401) {
      console.error('Unauthorized')
    } else {
      this.errorText = 'Error obteniendo la informacion del Servidor'
    }
  }

  closeDialog(clean?: boolean) {
    this.staffIndexDialog.nativeElement.close()
  }
}
