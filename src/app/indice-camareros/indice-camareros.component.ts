import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  ViewChild,
  Input,
  ElementRef
} from '@angular/core';

import { StaffService } from '../services/staff.service';

import { Filter } from '../models/filter';

@Component({
  selector: 'app-indice-camareros',
  templateUrl: './indice-camareros.component.html',
  styleUrls: ['./indice-camareros.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IndiceCamarerosComponent implements OnInit {
  @Input() filter: Filter;
  @ViewChild('indiceCamarerosDialog') indiceCamarerosDialog: ElementRef;

  constructor(service: StaffService) { }

  ngOnInit() {
    if (!this.indiceCamarerosDialog.nativeElement.showModal) {
      dialogPolyfill.registerDialog(this.indiceCamarerosDialog.nativeElement);
    }
  }

  showDialog() {
    this.indiceCamarerosDialog.nativeElement.showModal();
  }

  closeDialog(clean?: boolean) {
    this.indiceCamarerosDialog.nativeElement.close();
  }

}
