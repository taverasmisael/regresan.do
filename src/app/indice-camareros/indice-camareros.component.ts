import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  ViewChild,
  Input,
  ElementRef
} from '@angular/core';

@Component({
  selector: 'app-indice-camareros',
  templateUrl: './indice-camareros.component.html',
  styleUrls: ['./indice-camareros.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IndiceCamarerosComponent implements OnInit {

  @ViewChild('indiceCamarerosDialog') indiceCamarerosDialog: ElementRef;

  constructor() { }

  ngOnInit() {
    if (!this.indiceCamarerosDialog.nativeElement.showModal) {
      dialogPolyfill.registerDialog(this.indiceCamarerosDialog.nativeElement);
    }
  }

  showDialog() {
    this.indiceCamarerosDialog.nativeElement.showModal();
  }

}
