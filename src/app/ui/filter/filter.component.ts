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

import compare from 'just-compare';

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

  @Input() filters: Filter;
  @Output() applyFilters = new EventEmitter();

  @ViewChild('filterDialog') filterDialog: ElementRef;

  public filterForm: FormGroup;
  public filterFechaInicio: FormControl;
  public filterFechaFin: FormControl;
  public flatpickrOptions: FlatpickrOptions = { dateFormat: 'd/m/Y' };
  public lastFilter: Filter;
  public activeFilters: number;

  @HostBinding('class.mdl-grid') true;
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    let {fechaInicio: inicio, fechaFin: fin } = this.filters;
    this.filterFechaInicio = new FormControl(inicio, [Validators.required, DateValidator.spanishDate]);
    this.filterFechaFin = new FormControl(fin, [Validators.required, DateValidator.spanishDate]);

    this.lastFilter = this.filters;
    this.setActivesFilters();

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
