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
  @Output() sort = new EventEmitter();

  public order: 'asc' | 'desc';
  public sorting: string;

  constructor() { }

  ngOnInit() {
    Observable.of(this.loading)
      .map(val => val === true)
      .subscribe(() => componentHandler.upgradeAllRegistered());
  }


  sortBy(field: string) {
    this.order = field === this.sorting && this.order === 'asc' ? 'desc' : 'asc';
    this.sorting = field;
    this.sort.emit({field, order: this.order});
  }
}
