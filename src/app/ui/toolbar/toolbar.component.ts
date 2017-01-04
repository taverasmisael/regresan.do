import {
  Component,
  OnInit,
  AfterViewInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';

import { UserProfile } from '../../models/userprofile';
import { FlatpickrOptions } from '../../thirdparty/flatpickr/models';
import { DateValidator } from '../../utilities/validators/date.validator';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolbarComponent implements OnInit, AfterViewInit {

  @Input() sucursales: UserProfile[];
  @Input() totalGeneral: number;
  @Input() totalHoy: number;
  @Output() applyFilters = new EventEmitter();

  public filterForm: FormGroup;
  public filterSucursal: FormControl;
  public filterFechaInicio: FormControl;
  public filterFechaFin: FormControl;
  public flatpickrOptions: FlatpickrOptions = { dateFormat: 'd/m/Y' };

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.filterSucursal = new FormControl('', [Validators.required]);
    this.filterFechaInicio = new FormControl('', [Validators.required, DateValidator.spanishDate]);
    this.filterFechaFin = new FormControl('', [Validators.required, DateValidator.spanishDate]);

    this.filterForm = this.fb.group({
      sucursal: this.filterSucursal,
      fechaInicio: this.filterFechaInicio,
      fechaFin: this.filterFechaFin
    });
  }

  ngAfterViewInit() {
    componentHandler.upgradeAllRegistered();
  }

  sendFilters() {
    this.applyFilters.emit(this.filterForm.value);
  }

}
