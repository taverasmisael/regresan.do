import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  ViewChild,
  Input,
  ElementRef
} from '@angular/core';

import { StaffService } from '../services/staff.service';

import { APIRequestUser } from '../models/apiparams';

@Component({
  selector: 'app-indice-camareros',
  templateUrl: './indice-camareros.component.html',
  styleUrls: ['./indice-camareros.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IndiceCamarerosComponent implements OnInit {
  @Input() filter: APIRequestUser;
  @ViewChild('indiceCamarerosDialog') indiceCamarerosDialog: ElementRef;

  constructor(private service: StaffService) { }

  ngOnInit() {
    if (!this.indiceCamarerosDialog.nativeElement.showModal) {
      dialogPolyfill.registerDialog(this.indiceCamarerosDialog.nativeElement);
    }
  }

  showDialog() {
    console.log(this.filter);
    this.indiceCamarerosDialog.nativeElement.showModal();
    this.service.getKpisCamareros(this.filter)
      .map(res => res['Camareros'])
      .subscribe(res => console.log(res));
  }

  closeDialog(clean?: boolean) {
    this.indiceCamarerosDialog.nativeElement.close();
  }

}
