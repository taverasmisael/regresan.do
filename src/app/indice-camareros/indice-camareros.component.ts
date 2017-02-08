import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-indice-camareros',
  templateUrl: './indice-camareros.component.html',
  styleUrls: ['./indice-camareros.component.scss']
})
export class IndiceCamarerosComponent implements OnInit {

  @ViewChild('indiceCamarerosDialog') indiceCamarerosDialog: ElementRef;

  constructor() { }

  ngOnInit() {
  }

  showDialog() {
    this.indiceCamarerosDialog.nativeElement.showModal();
  }

}
