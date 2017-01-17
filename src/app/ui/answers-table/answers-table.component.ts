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

  constructor() { }

  ngOnInit() {
    Observable.of(this.loading)
      .map(val => val === true)
      .subscribe(() => componentHandler.upgradeAllRegistered());
  }

}
