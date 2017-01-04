import { Component, forwardRef, AfterViewInit, OnDestroy, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl } from '@angular/forms';
import { Flatpickr, FlatpickrOptions } from './models';

const flatpickr = require('flatpickr');
const spanish = require('flatpickr/dist/l10n/es');
@Component({
    selector: 'flatpickr',
    templateUrl: './flatpickr.component.html',
    styleUrls: ['./flatpickr.component.css']
})
export class FlatpickrComponent implements AfterViewInit, OnDestroy {

    @ViewChild('flatpickr')
    flatpickrElement: any;

    @Input()
    options: FlatpickrOptions = {};

    @Input() control: FormControl;

    @Input()
    set date(date: string | Date | string[] | Date[]) {
        this.selectedDates = date;
        this.setDate(date);
    }

    @Input()
    placeholder = '';

    @Input()
    disabled = false;

    @Input()
    required;

    @Output()
    ready = new EventEmitter<null>();

    @Output()
    opened = new EventEmitter<null>();

    @Output()
    closed = new EventEmitter<null>();

    @Output()
    dateChange = new EventEmitter<Date[]>();

    private flatpickr: Flatpickr;
    private flatpickrDefaultOptions = {
        onReady: () => this.ready.emit(),
        onOpen: () => this.opened.emit(),
        onClose: () => this.closed.emit(),
        onChange: (selectedDates: Date[]) => this.onChange(selectedDates),
        locale: spanish.es
    };

    private selectedDates;

    constructor() { }

    ngAfterViewInit() {
        let options = Object.assign(this.flatpickrDefaultOptions, this.options);
        this.flatpickr = this.flatpickrElement.nativeElement.flatpickr(options);
    }

    ngOnDestroy() {
        this.flatpickr.destroy();
    }

    public setDate(date) {
        if (this.flatpickr) {
            this.flatpickr.setDate(date);
        }
    }

    public clear() {
        this.flatpickr.clear();
    }

    public toggle() {
        this.flatpickr.toggle();
    }

    public open() {
        this.flatpickr.open();
    }

    public close() {
        this.flatpickr.close();
    }

    public parseDate(date: Date) {
        return this.flatpickr.parseDate(date);
    }

    ///////////////////////////////////////////

    private onChange(selectedDates: Date[]) {
        this.dateChange.emit(selectedDates);
    }
}
