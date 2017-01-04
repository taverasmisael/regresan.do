export interface FlatpickrOptions {

    altFormat?: string;

    altInput?: boolean;

    altInputClass?: string;

    allowInput?: boolean;

    clickOpens?: boolean;

    dateFormat?: string;

    defaultDate?: string | Date;

    disable?: string[] | Date[];

    enable?: string[] | Date[];

    enableTime?: boolean;

    enableSeconds?: boolean;

    hourIncrement?: number;

    inline?: boolean;

    maxDate?: string | Date;

    minDate?: string | Date;

    minuteIncrement?: number;

    mode?: 'single' | 'multiple' | 'range';

    nextArrow?: string;

    noCalendar?: boolean;

    enableDates?: { from: string, to: string } [] | string[] | Date[] | Function;

    disableDates?: { from: string, to: string } [] | string[] | Date[] | Function;

    weekNumbers?: boolean;

    utc?: boolean;

    locale?: string;

    wrap?: boolean;
}
