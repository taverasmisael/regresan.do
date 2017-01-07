import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-answers-tabs',
  templateUrl: './answers-tabs.component.html',
  styleUrls: ['./answers-tabs.component.scss']
})
export class AnswersTabsComponent implements OnInit {
  @Input() questions: any[];
  @Input() answers: any[];
  constructor() { }

  ngOnInit() {
  }

}
