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
  OnChanges,
  HostBinding,
  SimpleChanges
} from '@angular/core'

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'

import * as moment from 'moment'
import compare from 'just-compare'

import { UserProfile } from '@models/userprofile'
import { AnswerRequest } from '@models/answerRequest'
import { FlatpickrOptions } from '@thirdparty/flatpickr/models'
import { updateObject } from '@utilities/objects'
import { isValidUnix, toUnixDate } from '@utilities/dates'

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() filters: AnswerRequest
  @Input()
  questions: Array<{
    value: number
    text: string
    children: Array<{ value: string; text: string }>
  }>
  @Output() applyFilters = new EventEmitter()

  @HostBinding('class.mdl-grid') isMdlGrid = true
  @HostBinding('class.mdl-grid--no-spacing') noSpacing = true

  @ViewChild('filterDialog') filterDialog: ElementRef

  public filterForm: FormGroup
  public filterFechaInicio: FormControl
  public filterFechaFin: FormControl
  public filterQuestion: FormControl
  public filterAnswer: FormControl
  public lastFilter: AnswerRequest
  public activeFilters: number
  public startOptions: FlatpickrOptions
  public endOptions: FlatpickrOptions

  private flatpickrOptions: FlatpickrOptions
  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    let { start, end } = this.filters

    this.flatpickrOptions = { altFormat: 'd/m/Y', dateFormat: 'U', altInput: true }
    this.startOptions = updateObject(this.flatpickrOptions, { defaultDate: start })
    this.endOptions = updateObject(this.flatpickrOptions, { defaultDate: end })

    this.filterFechaInicio = new FormControl(start, [Validators.required])
    this.filterFechaFin = new FormControl(end, [Validators.required])
    this.filterQuestion = new FormControl({
      value: '',
      disabled: this.questions && !this.questions.length
    })
    this.filterAnswer = new FormControl({ value: '', disabled: this.filterQuestion.disabled })
    this.lastFilter = this.filters
    this.setActivesFilters()
    this.filterForm = this.fb.group({
      start: this.filterFechaInicio,
      end: this.filterFechaFin,
      question: this.filterQuestion,
      answer: this.filterAnswer
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    const questionsChange = changes['questions']
    if (questionsChange && questionsChange.currentValue.length && this.filterQuestion.disabled) {
      this.filterQuestion.enable()
      this.filterAnswer.enable()
    }
  }
  ngAfterViewInit() {
    componentHandler.upgradeAllRegistered()
    if (!this.filterDialog.nativeElement.showModal) {
      dialogPolyfill.registerDialog(this.filterDialog.nativeElement)
    }
    Array.from(document.querySelectorAll('.flatpickr-calendar')).forEach(el => {
      this.filterDialog.nativeElement.appendChild(el)
    })
  }

  showDialog() {
    this.filterDialog.nativeElement.showModal()
  }

  closeDialog(clean?: boolean) {
    this.filterDialog.nativeElement.close()
  }

  sendFilters(formData: FormGroup) {
    const filter = this.fixDateFilter(formData.value)
    if (this.shouldUpdateLastFilter(filter)) {
      this.lastFilter = filter
      this.applyFilters.emit(filter)
    }
    this.closeDialog()
  }

  private setActivesFilters() {
    this.activeFilters = Object.keys(this.lastFilter).length
  }

  private fixDateFilter(filter) {
    return updateObject(filter, {
      start: isValidUnix(filter.start) ? filter.start : toUnixDate(filter.start),
      end: isValidUnix(filter.end) ? filter.end : toUnixDate(filter.end)
    })
  }
  private shouldUpdateLastFilter(filter: AnswerRequest) {
    return !compare(filter, this.lastFilter)
  }
}
