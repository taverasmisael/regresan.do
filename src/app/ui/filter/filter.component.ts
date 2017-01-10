import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  HostBinding
} from '@angular/core';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';

import { UserProfile } from '../../models/userprofile';
import { Filter } from '../../models/filter';
import { FlatpickrOptions } from '../../thirdparty/flatpickr/models';
import { DateValidator } from '../../utilities/validators/date.validator';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterComponent implements OnInit, AfterViewInit {

  @Input() totalGeneral: number;
  @Input() totalHoy: number;
  @Output() applyFilters = new EventEmitter();

  @ViewChild('filterDialog') filterDialog: ElementRef;

  public filterForm: FormGroup;
  public filterFechaInicio: FormControl;
  public filterFechaFin: FormControl;
  public flatpickrOptions: FlatpickrOptions = { dateFormat: 'd/m/Y' };
  public lastFilter: Filter;
  @HostBinding('class.mdl-grid') true;
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
    if (!this.filterDialog.nativeElement.showModal) {
      dialogPolyfill.registerDialog(this.filterDialog.nativeElement);
    }
  }

  showDialog() {
    this.filterDialog.nativeElement.showModal();
  }

  sendFilters() {
    if (this.lastFilter !== this.filterForm.value) {
      this.lastFilter = this.filterForm.value;
      this.applyFilters.emit(this.filterForm.value);
    }
  }

}
