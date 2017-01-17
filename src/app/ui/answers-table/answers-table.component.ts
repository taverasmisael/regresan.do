import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-answers-table',
  templateUrl: './answers-table.component.html',
  styleUrls: ['./answers-table.component.scss']
})
export class AnswersTableComponent implements OnInit {
  @Input() questionsErrorText: string;
  @Input() answersErrorText: string;
  @Input() answers: any[];
  @Input() loading: boolean;
  @Output() failed = new EventEmitter();

  public order: 'asc' | 'desc';
  public sorting: string;

  private sort;
  constructor() { }

  ngOnInit() {
    this.sorting = 'fecha';
    this.sorting = 'fecha';
    Observable.of(this.loading)
      .map(val => val === true)
      .subscribe(() => componentHandler.upgradeAllRegistered());
  }


  sortBy(field: string) {
    console.log(this.sorting);
    console.log(this.sorting === `-${this.sorting}`);
    if (this.sort !== field) {
      this.sort = field;
      this.sorting = field;
    } else {
      if (this.sorting !== this.sort) {
        this.sorting = field;
      } else {
        this.sorting = `-${this.sorting}`;
      }
    }
  }
}
