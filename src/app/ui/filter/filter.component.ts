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

import * as moment from 'moment';
import compare from 'just-compare';

import { UserProfile } from '@models/userprofile';
import { DateFilter } from '@models/filter-date';
import { FlatpickrOptions } from '@thirdparty/flatpickr/models';
import { updateObject } from '@utilities/objects';


@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterComponent implements OnInit, AfterViewInit {

  @Input() filters: DateFilter;
  @Output() applyFilters = new EventEmitter();

  @ViewChild('filterDialog') filterDialog: ElementRef;

  public filterForm: FormGroup;
  public filterFechaInicio: FormControl;
  public filterFechaFin: FormControl;
  public lastFilter: DateFilter;
  public activeFilters: number;
  public startOptions: FlatpickrOptions;
  public endOptions: FlatpickrOptions;

  private flatpickrOptions: FlatpickrOptions;

  @HostBinding('class.mdl-grid') isGrid = true;
  @HostBinding('class.mdl-grid--no-spacing') noSpacing = true;
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    let { start, end } = this.filters;
    const altStart = moment.unix(+start).format('YYYY-MM-DD');
    const altEnd = moment.unix(+end).format('YYYY-MM-DD');

    this.flatpickrOptions = { altFormat: 'd/m/Y', dateFormat: 'U', altInput: true };
    this.startOptions = updateObject(this.flatpickrOptions, { defaultDate: altStart});
    this.endOptions = updateObject(this.flatpickrOptions, { defaultDate: altEnd});

    this.filterFechaInicio = new FormControl(altStart, [Validators.required]);
    this.filterFechaFin = new FormControl(altEnd, [Validators.required]);

    this.lastFilter = this.filters;
    this.setActivesFilters();
    this.filterForm = this.fb.group({
      start: this.filterFechaInicio,
      end: this.filterFechaFin
    });
  }

  ngAfterViewInit() {
    componentHandler.upgradeAllRegistered();
    if (!this.filterDialog.nativeElement.showModal) {
      dialogPolyfill.registerDialog(this.filterDialog.nativeElement);
    }
    Array.from(document.querySelectorAll('.flatpickr-calendar')).forEach(el => {
      this.filterDialog.nativeElement.appendChild(el);
    })
  }

  showDialog() {
    this.filterDialog.nativeElement.showModal();
  }

  closeDialog(clean?: boolean) {
    this.filterDialog.nativeElement.close();
  }

  sendFilters() {
    if (!compare(this.lastFilter, this.filterForm.value)) {
      this.lastFilter = this.filterForm.value;
      this.applyFilters.emit(this.filterForm.value);
    }
    this.closeDialog();
  }

  private setActivesFilters() {
    this.activeFilters = Object.keys(this.lastFilter).length;
  }

}
