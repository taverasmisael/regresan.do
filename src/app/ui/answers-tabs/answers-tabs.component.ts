import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-answers-tabs',
  templateUrl: './answers-tabs.component.html',
  styleUrls: ['./answers-tabs.component.scss']
})
export class AnswersTabsComponent implements OnInit {
  @Input() title: string;
  @Input() questions: any[];
  @Input() answers: any[];
  @Input() loading: boolean;

  constructor() { }

  ngOnInit() {
  }

  public getMyAnswers(id: number) {
    return this.answers.find(block => block.find(answer => +answer.pregunta === id));
  }

}
