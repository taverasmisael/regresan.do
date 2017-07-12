import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild
} from '@angular/core'

import { FormControl } from '@angular/forms'

@Component({
  selector: 'app-double-select',
  templateUrl: './double-select.component.html',
  styleUrls: ['./double-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DoubleSelectComponent implements OnInit {
  @ViewChild('primarySelect') primarySelect: ElementRef
  @Input() primaryLabel: string
  @Input() primaryControl: FormControl
  @Input() secondaryLabel: string
  @Input() secondaryControl: FormControl
  @Input() options: any

  public currentSecondary = []

  constructor() {}

  public ngOnInit() {}

  public onPrimaryChange($event) {

    this.currentSecondary = this.options.find(o => Number(o.value) === Number(this.primarySelect.nativeElement.value)).children
  }
}
