import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlatpickrComponent } from './flatpickr.component';

export { Flatpickr, FlatpickrOptions } from './models'

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
    ],
    declarations: [FlatpickrComponent],
    exports: [FlatpickrComponent],
})
export class FlatpickrModule { }
