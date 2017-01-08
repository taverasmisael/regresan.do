import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-answers-tabs',
  templateUrl: './answers-tabs.component.html',
  styleUrls: ['./answers-tabs.component.scss']
})
export class AnswersTabsComponent implements OnInit {
  @Input() title: string;
  @Input() questionsErrorText: string;
  @Input() answersErrorText: string;
  @Input() questions: any[];
  @Input() answers: any[];
  @Input() loading: boolean;
  @Output() failed = new EventEmitter();

  constructor() { }

  ngOnInit() {
    Observable.of(this.loading)
      .map(val => val === true)
      .subscribe(() => componentHandler.upgradeAllRegistered());
  }

  public getMyAnswers(id: number) {
    return this.answers.find(block => block.find(answer => +answer.pregunta === id));
  }

}
