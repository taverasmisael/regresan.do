export interface Flatpickr {
    changeMonth: (month: number, isOffset: boolean) => void;
    clear: () => void;
    close: () => void;
    open: () => void;
    toggle: () => void;
    destroy: () => void;
    formatDate: (format: string, date: Date) => void;
    jumpToDate: (date: Date) => void;
    parseDate: (date: Date) => void;
    redraw: () => void;
    set: (option, value) => void;
    setDate: (date: Date) => void;
}
