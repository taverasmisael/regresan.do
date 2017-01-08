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
import { Filter } from '../../models/toolbar-flters';
import { FlatpickrOptions } from '../../thirdparty/flatpickr/models';
import { DateValidator } from '../../utilities/validators/date.validator';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolbarComponent implements OnInit, AfterViewInit {

  @Input() totalGeneral: number;
  @Input() totalHoy: number;
  @Output() applyFilters = new EventEmitter();

  public filterForm: FormGroup;
  public filterFechaInicio: FormControl;
  public filterFechaFin: FormControl;
  public flatpickrOptions: FlatpickrOptions = { dateFormat: 'd/m/Y' };
  public lastFilter: Filter;
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.filterFechaInicio = new FormControl('', [Validators.required, DateValidator.spanishDate]);
    this.filterFechaFin = new FormControl('', [Validators.required, DateValidator.spanishDate]);

    this.filterForm = this.fb.group({
      fechaInicio: this.filterFechaInicio,
      fechaFin: this.filterFechaFin
    });
  }

  ngAfterViewInit() {
    componentHandler.upgradeAllRegistered();
  }

  sendFilters() {
    if (this.lastFilter !== this.filterForm.value) {
      this.lastFilter = this.filterForm.value;
      this.applyFilters.emit(this.filterForm.value);
    }
  }

}
